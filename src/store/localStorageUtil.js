class LocalStorageUtil {
    
    static setData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    
    static getData(key) {
        const value = localStorage.getItem(key);
        if (value === null) {
            return null
        } else if (value === undefined || value==="undefined") {
            return null
        } else {
            
            return JSON.parse(value);
        }

    }

    
    static hasData(key) {
        return localStorage.getItem(key) !== null;
    }

    
    static removeData(key) {
        localStorage.removeItem(key);
    }
}
if(false){
    
    const jwtToken = 'your_jwt_token';


    LocalStorageUtil.setData('jwtToken', jwtToken);


    if (LocalStorageUtil.hasData('jwtToken')) {
        
        const storedToken = LocalStorageUtil.getData('jwtToken');
        console.log(storedToken);

        
        LocalStorageUtil.removeData('jwtToken');
    }
}

export default LocalStorageUtil

