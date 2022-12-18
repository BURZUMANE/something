import {api} from "../configs/axiosConfig";
import {defineCancelApiObject} from "../configs/axiosUtils";

export interface IMatchEvent {
  event_id: number,
  event_type: string,
  event_time: number,
  match_id: number,
  score_amount?: number,
  score_team?: string
}

export interface ITeam {
  team_id: number,
  team_name: string,
  team_name_short: string
}

export interface IMatch {
  match_id: number,
  tournament_id: number,
  round: number,
  home_team_id: number,
  away_team_id: number
}

export interface IGetAllMatchesResponse {
  "phase": string,
  "teams": ITeam[],
  "matches": IMatch[],
  "events": any[]
}

export interface IUIMappedTeam {
  name: string,
  shortName: string,
  flagLink: string,
  score: number
}

export interface IUIMappedMatch {
  id: number,
  homeTeam: IUIMappedTeam
  awayTeam: IUIMappedTeam,
  state: string
}

function getState(events: IMatchEvent[], match: IMatch) {
  // Find the last event with the correct event type which is also the current match state.
  for (let i = events.length - 1; i >= 0; i--) {
    if ((events[i].match_id === match.match_id) &&
      ((events[i].event_type === "match_start") ||
        (events[i].event_type === "match_halftime") ||
        (events[i].event_type === "match_end"))) {
      return events[i].event_type.split('_').join(' ');
    }
  }

  return "didn't start";
}

function getScoreForTeam(events: IMatchEvent[], match: IMatch, teamId: number) {
  const scoreTeam = teamId === match.home_team_id ? "home" : "away";
  let score = events
    .filter(event => event.event_type === "goal" && event.match_id === match.match_id && event.score_team === scoreTeam)
    .map(event => event.score_amount || 0)
    .reduce((sum, current) => sum + current, 0);

  return score;
}

function getTeam(teams: ITeam[], events: any[], match: IMatch, teamId: number, flagsLink: string) {
  const team = teams.find(item => item.team_id === teamId);

  if (!team) {
    return null;
  }

  const name = team.team_name;
  const shortName = team.team_name_short;
  const flagLink = flagsLink + `logo_${teamId}.png`;
  const score = getScoreForTeam(events, match, teamId);

  return {
    name,
    shortName,
    flagLink,
    score
  };
}

function mapMatches(data: IGetAllMatchesResponse, teamLogoLink: string): IUIMappedMatch[] {
  let matches = data.matches.reduce((acc: IUIMappedMatch[], currMatch) => {
    const homeTeam = getTeam(data.teams, data.events, currMatch, currMatch.home_team_id, teamLogoLink)
    const awayTeam = getTeam(data.teams, data.events, currMatch, currMatch.away_team_id, teamLogoLink);

    (homeTeam && awayTeam) &&
    acc.push({
      id: currMatch.match_id,
      homeTeam,
      awayTeam,
      state: getState(data.events, currMatch)
    })
    return acc;
  }, [])

  return matches;
}

export const MatchAPI = {
  getAllMatches: async function (cancel = false): Promise<IUIMappedMatch[]> {
    try {
      const response = await api.get<IGetAllMatchesResponse>('', {
        signal: cancelApiObject['getAllMatches'].handleRequestCancellation().signal,
      })

      return mapMatches(response.data, api.defaults.baseURL + '/images/')
    } catch (error) {
      return []
    }
  },
}

export const cancelApiObject = defineCancelApiObject(MatchAPI)
