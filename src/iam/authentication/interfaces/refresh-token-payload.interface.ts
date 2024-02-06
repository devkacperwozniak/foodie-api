export interface RefreshTokenPayload {
  /**
   * The "subject" of the token. The value of this property is the user ID
   * that granted this token.
   */
  sub: number;

  /**
   * The refreshTokenId uuid.
   */
  refreshTokenId: string;
}
