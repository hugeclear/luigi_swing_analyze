interface UserGolfVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  userTags: string[];
  weaknessTargets: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  personalNotes: string;
  addedAt: string;
  lastWatched?: string;
  watchCount: number;
  userRating: number;
  isCompleted: boolean;
}

interface PlaylistStats {
  totalVideos: number;
  completedVideos: number;
  averageRating: number;
  weaknessCoverage: Record<string, number>;
  lastActivity: string;
}

export class PersonalPlaylistManager {
  private static readonly STORAGE_KEY = 'personal-golf-playlist';
  private static readonly STATS_KEY = 'playlist-stats';

  static getPlaylist(): UserGolfVideo[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static async addVideoFromURL(
    youtubeUrl: string, 
    userInputs: {
      weaknessTargets: string[];
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      userTags: string[];
      personalNotes: string;
    }
  ): Promise<{ success: boolean; video?: UserGolfVideo; error?: string }> {
    
    try {
      const videoId = this.extractVideoId(youtubeUrl);
      if (!videoId) {
        return { success: false, error: 'Invalid YouTube URL' };
      }

      const playlist = this.getPlaylist();
      if (playlist.some(v => v.youtubeId === videoId)) {
        return { success: false, error: 'Video already in playlist' };
      }

      const videoInfo = await this.getVideoBasicInfo(youtubeUrl, videoId);
      
      const userVideo: UserGolfVideo = {
        id: `user_${Date.now()}`,
        youtubeId: videoId,
        title: videoInfo.title,
        channel: videoInfo.channel,
        thumbnailUrl: videoInfo.thumbnail,
        youtubeUrl,
        userTags: userInputs.userTags,
        weaknessTargets: userInputs.weaknessTargets,
        difficulty: userInputs.difficulty,
        personalNotes: userInputs.personalNotes,
        addedAt: new Date().toISOString(),
        watchCount: 0,
        userRating: 0,
        isCompleted: false
      };

      playlist.unshift(userVideo);
      this.savePlaylist(playlist);
      this.updateStats();

      console.log('✅ Video added to personal playlist:', userVideo.title);
      return { success: true, video: userVideo };

    } catch (error) {
      console.error('Failed to add video:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private static async getVideoBasicInfo(url: string, videoId: string): Promise<{
    title: string;
    channel: string;
    thumbnail: string;
  }> {
    
    try {
      const { YouTubeAPIService } = await import('./youtubeAPIService');
      const videos = await YouTubeAPIService.getVideoDetails(videoId);
      if (videos.length > 0) {
        const video = videos[0];
        return {
          title: video.title,
          channel: video.channelTitle,
          thumbnail: video.thumbnails.medium
        };
      }
    } catch (error) {
      console.warn('API call failed, using fallback:', error);
    }

    return {
      title: `Video: ${videoId}`,
      channel: 'YouTube',
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    };
  }

  private static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }

  static updateVideo(videoId: string, updates: Partial<UserGolfVideo>): boolean {
    const playlist = this.getPlaylist();
    const index = playlist.findIndex(v => v.id === videoId);
    
    if (index === -1) return false;
    
    playlist[index] = { ...playlist[index], ...updates };
    this.savePlaylist(playlist);
    this.updateStats();
    return true;
  }

  static removeVideo(videoId: string): boolean {
    const playlist = this.getPlaylist().filter(v => v.id !== videoId);
    this.savePlaylist(playlist);
    this.updateStats();
    return true;
  }

  static markAsWatched(videoId: string): boolean {
    return this.updateVideo(videoId, {
      lastWatched: new Date().toISOString(),
      watchCount: (this.getPlaylist().find(v => v.id === videoId)?.watchCount || 0) + 1
    });
  }

  static markAsCompleted(videoId: string, rating: number): boolean {
    return this.updateVideo(videoId, {
      isCompleted: true,
      userRating: rating,
      lastWatched: new Date().toISOString()
    });
  }

  static getRecommendationsForWeakness(
    weakness: string,
    excludeCompleted: boolean = true
  ): UserGolfVideo[] {
    const playlist = this.getPlaylist();
    
    return playlist
      .filter(video => {
        if (excludeCompleted && video.isCompleted) return false;
        return video.weaknessTargets.includes(weakness);
      })
      .sort((a, b) => {
        if (a.watchCount === 0 && b.watchCount > 0) return -1;
        if (a.watchCount > 0 && b.watchCount === 0) return 1;
        if (a.userRating !== b.userRating) return b.userRating - a.userRating;
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      })
      .slice(0, 5);
  }

  static getPlaylistStats(): PlaylistStats {
    const playlist = this.getPlaylist();
    
    const weaknessCoverage: Record<string, number> = {};
    playlist.forEach(video => {
      video.weaknessTargets.forEach(weakness => {
        weaknessCoverage[weakness] = (weaknessCoverage[weakness] || 0) + 1;
      });
    });

    const completedVideos = playlist.filter(v => v.isCompleted);
    const ratedVideos = playlist.filter(v => v.userRating > 0);

    return {
      totalVideos: playlist.length,
      completedVideos: completedVideos.length,
      averageRating: ratedVideos.length > 0 
        ? ratedVideos.reduce((sum, v) => sum + v.userRating, 0) / ratedVideos.length 
        : 0,
      weaknessCoverage,
      lastActivity: playlist.length > 0 ? playlist[0].addedAt : new Date().toISOString()
    };
  }

  private static savePlaylist(playlist: UserGolfVideo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(playlist));
  }

  private static updateStats(): void {
    const stats = this.getPlaylistStats();
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  static exportPlaylist(): string {
    const playlist = this.getPlaylist();
    const stats = this.getPlaylistStats();
    
    return JSON.stringify({
      playlist,
      stats,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  static importPlaylist(jsonData: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonData);
      if (data.playlist && Array.isArray(data.playlist)) {
        this.savePlaylist(data.playlist);
        this.updateStats();
        return { success: true };
      }
      return { success: false, error: 'Invalid format' };
    } catch (error) {
      return { success: false, error: 'Invalid JSON' };
    }
  }
}

export type { UserGolfVideo, PlaylistStats };
