import { routes } from '@project-shared/shared';
import { NextPageContext } from 'next';
import { Component, ReactNode } from 'react';
import { Container } from '../../components/common/gridSystem';
import Layout1 from '../../components/layouts/layout1';
import {
  ConfirmUserMutation,
  ConfirmUserMutationVariables
} from '../../graphql/user/modelGenerated';
import { confirmUserMutation } from '../../graphql/user/mutation/confirmUser';
import Apollo from '../../lib/apollo';
import { redirect } from '../../lib/redirect';
import { trp } from '../../lib/translations';

interface InitialProps {
  token: string;
  data: ConfirmUserMutation | null | undefined;
}

class Confirm extends Component<InitialProps> {
  static async getInitialProps(ctx: NextPageContext): Promise<InitialProps> {
    const token = ctx.query.token as string;
    const apolloClient = Apollo.getClient();
    const { data } = await apolloClient.mutate<ConfirmUserMutation, ConfirmUserMutationVariables>({
      mutation: confirmUserMutation,
      variables: {
        token
      }
    });

    if (data?.confirmUser) redirect(ctx, trp({ tRoutes: routes.login }));

    const initialProps: InitialProps = {
      token,
      data
    };

    return initialProps;
  }

  render(): ReactNode {
    return (
      <Layout1>
        <Container alignItems="center">
          <h1>o-ou... something went wrong</h1>

          <div>possible causes</div>
          <ul>
            <li>user already verified (login)</li>
            <li>verifying link expired (register again)</li>
          </ul>
          <pre>{JSON.stringify(this.props, null, 4)}</pre>
        </Container>
      </Layout1>
    );
  }
}

export default Confirm;
