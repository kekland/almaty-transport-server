import { Datastore, DatastoreManager } from 'lapisdb';
import { Route } from '../routes/route';
import { Resolver, Field, ArgsType, Query, Args, Subscription, Root, PubSubEngine, Arg } from 'type-graphql';
import { IsArray, IsString } from 'class-validator';
import { join } from 'path';

@ArgsType()
class GetRoutesArgs {
  @Field(type => [String])
  @IsArray()
  @IsString({ each: true })
  routes!: string[];
}

@Resolver(of => Route)
export class RouteResolver {
  datastore!: Datastore<Route>

  constructor() {
    this.datastore = DatastoreManager.get(Route)
  }

  @Query(returns => [Route])
  async routes(@Args() { routes }: GetRoutesArgs) {
    // sample implementation
    const routesToPick = routes.filter((v, i) => i < 7)
    return this.datastore.getItems((r) => routesToPick.includes(r.id))
  }

  @Subscription({
    topics: ({ args, payload, context }) => args.routes,
  })
  onBusUpdate(@Arg('routes', () => [String]) routes: string[], @Root() notificationPayload: Route): Route {
    return notificationPayload
  }
}
