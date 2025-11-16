// type Token struct {
// 	Plaintext string    `json:"token"`
// 	Hash      []byte    `json:"-"`
// 	UserID    int64     `json:"-"`
// 	Expiry    time.Time `json:"expiry"`
// 	Scope     string    `json:"-"`
// }

export interface Token {
  plaintext: string;
  hash: Buffer<ArrayBufferLike>;
  userID: number;
  expiry: Date;
  scope: string;
}

export type TokenScope = "authentication" | "activation";
