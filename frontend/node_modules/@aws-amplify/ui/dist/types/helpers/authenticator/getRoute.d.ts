import { AuthActorState, AuthMachineState } from '../../machines/authenticator/types';
import { AuthenticatorRoute } from './facade';
export type GetRoute = (state: AuthMachineState, actorState: AuthActorState) => AuthenticatorRoute;
export declare const getRoute: (state: AuthMachineState, actorState: AuthActorState) => AuthenticatorRoute;
