export interface IAniListMediaTitle {
  /**
   * @var {string} romaji contains the original title in latin characters (rōmaji)
   */
  romaji: string;
  /**
   * @var {string} english contains the English-translated title of the media
   */
  english: string;
  /**
   * @var {string} native contains the original title written in its native language
   */
  native: string;
  /**
   * @var {string} userPreferred contains the title using the user's preference
   */
  userPreferred: string;
}
