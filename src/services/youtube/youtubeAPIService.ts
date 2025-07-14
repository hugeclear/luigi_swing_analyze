interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  tags: string[];
  categoryId: string;
  defaultLanguage?: string;
}

export class YouTubeAPIService {
  private static readonly API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'demo_key';
  private static readonly BASE_URL = 'https://www.googleapis.com/youtube/v3'\;
  private static quotaUsed = 0;
  private static readonly QUOTA_LIMIT = parseInt(import.meta.env.VITE_YOUTUBE_QUOTA_LIMIT || '10000');

  static async getVideoDetails(videoIds: string): Promise<YouTubeVideo[]> {
    // APIキーが設定されていない場合はモックデータ
    if (this.API_KEY === 'demo_key') {
      console.warn('⚠️ YouTube API key not configured, using mock data');
      return this.getMockVideoData(videoIds);
    }

    this.quotaUsed += videoIds.split(',').length;
    
    const params = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      id: videoIds,
      key: this.API_KEY
    });

    try {
      const response = await fetch(`${this.BASE_URL}/videos?${params}`);
      const data = await response.json();
      
      return data.items.map((item: any) => this.mapToYouTubeVideo(item));
    } catch (error) {
      console.error('Failed to get video details:', error);
      return this.getMockVideoData(videoIds);
    }
  }

  private static getMockVideoData(videoIds: string): YouTubeVideo[] {
    const ids = videoIds.split(',');
    return ids.map(id => ({
      id,
      title: `Golf Video ${id}`,
      description: 'Sample golf instruction video',
      channelTitle: 'Sample Golf Channel',
      channelId: 'sample_channel',
      thumbnails: {
        default: `https://img.youtube.com/vi/${id}/default.jpg`,
        medium: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
        high: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      },
      publishedAt: new Date().toISOString(),
      duration: '10:00',
      viewCount: Math.floor(Math.random() * 100000),
      likeCount: Math.floor(Math.random() * 5000),
      tags: ['golf', 'instruction', 'tips'],
      categoryId: '17'
    }));
  }

  private static mapToYouTubeVideo(item: any): YouTubeVideo {
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnails: {
        default: item.snippet.thumbnails.default?.url || '',
        medium: item.snippet.thumbnails.medium?.url || '',
        high: item.snippet.thumbnails.high?.url || ''
      },
      publishedAt: item.snippet.publishedAt,
      duration: this.parseDuration(item.contentDetails?.duration || 'PT0S'),
      viewCount: parseInt(item.statistics?.viewCount || '0'),
      likeCount: parseInt(item.statistics?.likeCount || '0'),
      tags: item.snippet.tags || [],
      categoryId: item.snippet.categoryId,
      defaultLanguage: item.snippet.defaultLanguage
    };
  }

  private static parseDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static getQuotaStatus(): { used: number; limit: number; remaining: number; percentage: number } {
    return {
      used: this.quotaUsed,
      limit: this.QUOTA_LIMIT,
      remaining: this.QUOTA_LIMIT - this.quotaUsed,
      percentage: (this.quotaUsed / this.QUOTA_LIMIT) * 100
    };
  }
}

export type { YouTubeVideo };
