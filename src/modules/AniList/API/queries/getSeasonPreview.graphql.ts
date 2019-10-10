export default `
query getSeasonAnime($seasonYear: Int, $season: MediaSeason, $page: Int) {
  page: Page(page: $page) {
    media(season: $season, seasonYear: $seasonYear, type: ANIME) {
      id
      title {
        userPreferred
      }
      startDate {
        year
        month
        day
      }
      episodes
      streamingEpisodes {
        title
        url
      }
      coverImage {
        extraLarge
      }
      studios(isMain: true) {
        nodes {
          name
          isAnimationStudio
        }
      }
      bannerImage
      genres
      nextAiringEpisode {
        episode
        timeUntilAiring
      }
      isAdult
      isLocked
      description
    }
  }
}
`;
