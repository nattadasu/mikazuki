export interface IAniListStreamingEpisode {
  /**
   * @var {string} title contains the title of the episode
   */
  title: string;
  /**
   * @var {string} thumbnail contains the URL of the episode thumbnail
   */
  thumbnail: string;
  /**
   * @var {string} url contains the URL to the episode of the streaming site
   */
  url: string;
  /**
   * @var {string} site contains the name of the streaming service
   */
  site: string;
}
