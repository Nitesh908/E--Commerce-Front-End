import {postAccessToken} from "../configs/services";
import {loginStatus, logoutStatus} from "../features/userSlice";
export function validateIdentification(dispatch) {
    postAccessToken().then(res=>{
        const response = JSON.parse(res.data)
        console.log("JTW response=>", response)
        dispatch(loginStatus(response.object))
    }).catch(err=>{
        console.log("Expirated, err:", err)
        dispatch(logoutStatus())
    })
}

export async function validateJwt() {
    return await postAccessToken()
}