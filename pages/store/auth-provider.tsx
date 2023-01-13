import React, {useEffect, useState} from "react";
import {ContextInterface} from "../models/context-interface";
import {LoginResponseModel} from "../models/LoginResponseModel";
import {BaseService} from "../shared/base.service";
import {useRouter} from "next/router";

export const AuthContext = React.createContext<ContextInterface>({
    canLogout: () => {},
    canLogin: (value: LoginResponseModel) => {},
    isAuthenticated: false });

export const AuthProvider = (props: any) => {
    const router = useRouter();
    const loginHandler = (value: LoginResponseModel) => {
        setAuth((prevState) => {
            return {...prevState, isAuthenticated: true, accesstoken: value.accesstoken, user: value.user}
        })
    }

    const logOutHandler = () => {
        setAuth((prevState) => {
            return {...prevState, isAuthenticated: false}
        });
        BaseService.clearSessionData();
        router.push('/');
    }

    const [auth, setAuth] = useState<ContextInterface>({ canLogout: logOutHandler, canLogin: loginHandler, isAuthenticated: false });

    const [state, setState] = useState<ContextInterface>({ canLogout: logOutHandler, canLogin: loginHandler, isAuthenticated: false });

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        let accessObj: LoginResponseModel = JSON.parse(localStorage.getItem(BaseService.key) as string) as LoginResponseModel;
        if (accessObj) {
            interval = setInterval(() => {
                const seconds = Math.round( BaseService.getTimeLeft(accessObj.accesstoken?.expire, new Date()));
                if (seconds === 0) {
                    router.push('/').then();
                }
            }, 3000);
            setState((prevState) => {
                return { ...prevState, accesstoken: accessObj.accesstoken, isAuthenticated: true, canLogin: loginHandler, canLogout: logOutHandler, user: accessObj.user }
            });
            return () => clearInterval(interval);
        }
    }, [auth]);

    useEffect(() => {
        // console.log('state', state);
    }, [state])

    return (
      <AuthContext.Provider value={state}>
          {props.children}
      </AuthContext.Provider>
  )
}
