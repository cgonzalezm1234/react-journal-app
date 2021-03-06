import Swal from 'sweetalert2';

import { firebase, googleAuthProvider } from '../firebase/firebase-config'
import { types } from "../types/types"
import { notesLogoutCleaning } from './notes';
import { finisLoading, startLoading } from './ui';

export const startLoginEmailPassword = ( email, password) => {

    return ( dispatch ) => {
        
        dispatch( startLoading() );
        firebase.auth().signInWithEmailAndPassword( email, password).then((userCredential) => {
            const { uid, displayName } = userCredential.user;
            dispatch( login(uid,  displayName));
            dispatch( finisLoading() );
        })
        .catch( error => {
            dispatch( finisLoading() );

            Swal.fire( 'Error', error.message, 'error' )
          });
    }
}

export const startRegisterWithEmailPasswordName = ( email, password, name) => {
    return ( dispatch ) => {

        firebase.auth().createUserWithEmailAndPassword( email, password)
        .then( async ({ user }) => {

            await user.updateProfile( { displayName: name } );

            console.log(user)
            dispatch( 
                login( user.uid, user.displayName )
            )
        })
        .catch( error => {
            Swal.fire( 'Error', error.message, 'error' )
        })

    }
}

export const startGoogleLogin = () => {
    return ( dispatch ) => {
            firebase.auth().signInWithPopup( googleAuthProvider )
                .then( ({ user }) => {
                    dispatch( 
                        login( user.uid, user.displayName )
                    )
                })
    }
}

export const login = (uid, displayName) => ({
    type: types.login,
    payload: {
        uid,
        displayName,
    }
});

export const startLogout = () => {
    return async ( dispatch ) => {
        await firebase.auth().signOut()

        dispatch( logout() )

        dispatch( notesLogoutCleaning() )
    }
}

export const logout = () => ({
    type: types.logout
})
