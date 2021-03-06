import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import moment from 'moment';
import { Alert, AlertsQuery, MutationResolvers, Query } from '../graphql/store/modelGenerated';
import { alertsQuery } from '../graphql/store/query/alerts';
import { AppStore } from './initialState';

export const resolvers = {
  Mutation: {
    addAlert: (parent, { inputData }, { cache }: { cache: InMemoryCache }) => {
      const result = cache.readQuery<AlertsQuery>({ query: alertsQuery });
      const { alerts } = result!;

      const getId = (alerts: Query['alerts']) => {
        if (alerts.length) {
          return alerts[0]!.id + 1;
        } else {
          return 0;
        }
      };

      const newAlert: Alert = {
        __typename: 'Alert',
        id: getId(alerts) as string,
        body: '',
        icon: '',
        display: true,
        timestamp: moment().toISOString(),
        ...inputData
      };

      const data: Pick<AppStore, 'alerts'> = {
        alerts: [newAlert, ...(alerts as Alert[])]
      };

      cache.writeData({ data });

      return newAlert;
    },
    hideAlert: (
      parent,
      { id },
      { cache, getCacheKey }: { cache: InMemoryCache; getCacheKey: any }
    ) => {
      const cacheId = getCacheKey({ __typename: 'Alert', id });
      const fragment = gql`
        fragment displayAlert on Alert {
          display
        }
      `;

      cache.writeFragment({
        fragment,
        id: cacheId,
        data: {
          __typename: 'Alert',
          display: false
        }
      });

      return true;
    },
    setLanguage: (parent, { language }, { cache }: { cache: InMemoryCache }) => {
      const data: Pick<AppStore, 'language'> = {
        language
      };

      cache.writeData({ data });

      return true;
    }
  }
} as {
  Mutation: MutationResolvers;
};
