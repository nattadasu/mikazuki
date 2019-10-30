export interface IAniListNextAiringEpisode {
  /**
   * @var {number} airingAt contains the timestamp the episode airs at.
   */
  airingAt: number;
  /**
   * @var {number} timeUntilAiring contains the amount of seconds until airing
   */
  timeUntilAiring: number;
  /**
   * @var {number} episode contains the episode number that airs
   */
  episode: any;
  /**
   * @var {number} mediaId contains the associated mediaId
   */
  mediaId: number;
}
