// ONNX Runtime Web の型定義（独自実装）
declare module 'onnxruntime-web' {
  export interface Tensor {
    readonly data: Float32Array | Uint8Array | number[];
    readonly dims: readonly number[];
    readonly type: string;
  }

  export class Tensor {
    constructor(type: string, data: Float32Array | number[], dims: number[]);
  }

  export interface InferenceSession {
    run(feeds: Record<string, Tensor>): Promise<Record<string, Tensor>>;
    release(): void;
  }

  export namespace InferenceSession {
    function create(path: string, options?: any): Promise<InferenceSession>;
  }

  export const env: {
    wasm: {
      wasmPaths: string;
    };
  };
}
