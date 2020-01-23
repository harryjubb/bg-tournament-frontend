import React from 'react';
import {useParams} from 'react-router-dom'

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

const GET_EVENT = gql`
query ($eventCode: String!) {
  event (code: $eventCode) {
    id
    code
    name
    players {
      id
      name
      eventPlayCount (eventCode: $eventCode)
      eventWinCount (eventCode: $eventCode)
      eventLossCount (eventCode: $eventCode)
      eventTotalScore (eventCode: $eventCode)
    }
  }
}
`

const Dashboard: React.FC = () => {

  const {eventCode} = useParams()
  const {loading, error, data} = useQuery(GET_EVENT, {
    variables: {
      eventCode
    }
  })

  return (
    <div>
      {eventCode}
      {JSON.stringify(data)}
    </div>
  )
}
export default Dashboard
