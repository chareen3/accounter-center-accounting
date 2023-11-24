import React,{useEffect,useState} from 'react'; 
import Axios from 'axios';
import {connect} from 'react-redux';
import {API_URL} from '../../config.json';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import './commons.css'
let InstitutionProfile = ({authInfo}) =>{
    let [institution,institutionSet] = useState(null);
    useEffect(()=>{
        getProfile()
    },[])

    let getProfile = async ()=>{
        await axios.get(`${API_URL}/api/get-institution`,{headers:{'auth-token':authInfo.token}}).then(res=>{
            institutionSet(res.data)
        });
    }

    return(
        <div className="print-source">
                    <html lang="en">
                    <head>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                    <meta charset="utf-8" />
                    <meta name="description" content="Static &amp; Dynamic Tables" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
                    <title>Profile</title>
                    </head>
                    <body>
                       
                          <div style={{width:'100%'}}>
                                <div style={{width:'10%',float:'left',marginLeft:'3%'}}>
                                <img alt={institution != null ?institution.pro_name:''} 
                                src={`${API_URL}/${institution != null ? institution.pro_logo:''}`} style={{width:'100px',height:'100px'}} />
                                </div>
                                <div style={{width:'80%',float:'right',marginLeft:'5%'}}>
                                <h2 style={{textAlign:'center'}}>{institution != null ? institution.pro_name  :''}</h2>
                                      <p style={{textAlign:'center'}}>{institution != null ? institution.pro_desc:''}</p>
                                </div>
                          </div>
                               
                           
                            
                                    
                          
                    </body>
                    </html>
        </div>
    )
}

const mapStateToPops = (state)=>{
    return {
      authInfo:state.authInfoReducer
    }
}

export default connect(mapStateToPops,{})(InstitutionProfile);