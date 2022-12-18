import React, {Fragment, useState} from 'react'
import {usePolling} from "../hooks/usePolling";
import {cancelApiObject, IUIMappedMatch, MatchAPI} from "../apis/MatchAPI/MatchAPI";
import styles from './MatchListComponent.module.css'

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {

}

const MatchListComponent: React.FC<Props> = () => {
  const pollingInterval = 10000;
  const [isLong, setIsLong] = useState(false)
  const {data: matches} = usePolling<IUIMappedMatch[]>(
    pollingInterval,
    MatchAPI.getAllMatches,
    cancelApiObject['getAllMatches'].handleRequestCancellation
  )

  return (
    <Fragment>
      {!!matches &&
          <Fragment>
              <button
                  onClick={() => setIsLong(!isLong)}
                  className="bg-pink-700/50 w-60 rotate-45 pl-6 py-5 absolute z-10 -right-20 -top-5 uppercase text-amber-50 font-medium">
                  <span className="block">{isLong ? "Short" : "Long"}</span>
                  <span>Names</span>
              </button>
              <div
                  className="rounded-lg max-h-4/5 overflow-scroll w-11/12 md:w-5/6 lg:w-6/12 p-3 bg-white/20 backdrop-blur-sm drop-shadow-xl text-amber-50 text-2xl"
                  data-testid="match-list-component"
              >
                {matches.map(({id, homeTeam, awayTeam, state}) => {
                  return <div
                    key={id}
                    className={styles.grid}>
                    <div className="flex flex-col items-center text-center">
                      <img src={homeTeam.flagLink} alt="" width="60"/>
                      <span>{isLong ? homeTeam.name : homeTeam.shortName}</span>
                    </div>
                    <div className="text-center bg-pink-700/20 rounded-lg h-max my-auto">
                      <span className="hidden sm:block text-xl capitalize">{state}</span>
                      <div className="text-5xl">
                        {homeTeam.score}:{awayTeam.score}
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <img src={awayTeam.flagLink} alt="" width="60"/>
                      <span>{isLong ? awayTeam.name : awayTeam.shortName}</span>
                    </div>
                  </div>
                })}
              </div>
          </Fragment>
      }
    </Fragment>
  );
};

export default MatchListComponent;