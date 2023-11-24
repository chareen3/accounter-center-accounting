import React,{Fragment, useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import { useForm } from "react-hook-form";
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MUIDataTable from "mui-datatables";
import {APP_URL,API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

import { Modal } from 'react-responsive-modal';
import "react-responsive-modal/styles.css";


import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import socketIOClient from "socket.io-client";
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum,currentDateTime,getDateTimeFromISODT} from '../../lib/functions'
import {currentRouteSet} from '../../actions/actions';
import moment from 'moment';


const BankTransManage = ({location,currentRouteSet,authInfo})=>{
    const classes = useStyles();
   
    
    let [action,actionSet] = useState('create');
    let [tran_note,tran_note_set] = useState('');
    let [tran_amount,tran_amount_set] = useState('');
    
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)

    let [tran_id,tran_id_set] = useState(0)

    
     
    let [trans,transSet] = useState([])
    let [tran_code,tran_code_set] = useState('')
    let [selectedTranType,selectedTranTypeSet] = useState(null)
    let tranTypes = [{tran_type_id:'deposit',tran_type:'Cash Deposit'},{tran_type_id:'withdraw',tran_type:'Cash Withdraw'}]
    
    
    const [selectedDate, handleDateChange] = useState(currentDateTime);

    let bankTranCodeRef = React.useRef(null)
    let bankTranTypeRef = React.useRef(null)
    let bankTranAccRef = React.useRef(null)
    let bankTranDateRef = React.useRef(null)
    let bankTranNoteRef = React.useRef(null)
    let bankTranAmountRef = React.useRef(null) 
    let bankTranActionRef = React.useRef(null) 
    const [successMsg, setSuccessMsg] = useState({
      open: false,
      vertical: 'top',
      horizontal: 'center',
      msg:''
    });
    const { vertical, horizontal, open,msg } = successMsg;
    const handleClose = () => {
      setSuccessMsg({ ...successMsg, open: false });
    };

    useEffect(()=>{
       currentRouteSet(pathSpliter(location.pathname,1));
       getTrans()
       getCDWCode()

    },[]);

     const getCDWCode = async ()=>{
      await axios.get(`${API_URL}/api/get-cash-d-w-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
        tran_code_set(res.data.message)
      })
     }
     

   
       const getTrans = async ()=>{
        loadingListSet(true)
        await axios.post(`${API_URL}/api/get-cash-d-w-trans`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
          loadingListSet(false)
          transSet(res.data)
        })
       }

    

  
    const saveFormAction = async ()=>{   

      if(selectedTranType==null){  
        swal({
          title:'Select a  transaction type',
          icon:'warning'
        })
      }else if(tran_amount==''  ){  
        swal({
          title:'Transaction amount is required.',
          icon:'warning'
        })
      }else{   
            let payLoad = {
              tran_created_isodt : selectedDate,
              tran_type : selectedTranType != null ? selectedTranType.tran_type_id:null,
              tran_note,
              tran_amount,
              action,
              tran_id
            }
            
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/cash-d-w-transaction-cu`,payLoad,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)
            
            selectedTranTypeSet(null)
            handleDateChange(currentDateTime)

            tran_note_set('')
            tran_amount_set(0)
            actionSet('create')
            swal({
              title:res.data.message,
              icon:'success'
            })
            getCDWCode()
            getTrans()
            
            })
         }
    }

    const bankTranEdit = (row,index)=>{
      tran_code_set(trans[index].tran_code)
     
    
      selectedTranTypeSet({tran_type:trans[index].tran_type,tran_type_id:trans[index].tran_type})
      handleDateChange(trans[index].created_isodt)

      tran_amount_set(trans[index].tran_amount);
      tran_note_set(trans[index].tran_note)
      tran_id_set(trans[index].tran_id)
      actionSet('update')

    }
    const cusomerDisable = async (tranId)=>{

      swal({
        title:'Are you sure delete this?',
        icon:'warning'
      }).then(async(res)=>{
        if(res){

          await axios.post(`${API_URL}/api/cash-d-w-delete`,{tran_id:tranId},{headers:{'auth-token':authInfo.token}}).then((res)=>{
            getTrans()
            swal({
              title:'You have successfully deleted.',
              icon:'success'
            })
           
          })

          
        }else{
          return false
        }
      })
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
            {
    authInfo.role !='user'?(
    <>
        
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>bankTranEdit(props.rowData,props.rowIndex)}/>
          {props.rowData[1]=='a'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>cusomerDisable(props.rowData[0],props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>cusomerDisable(props.rowData[0],props.rowIndex)}/>
          )}        
   </>):''
 }
        </div>)
      
      }
      
    const columns = [
        {name: "tran_id",options: { display: 'excluded' }},
        {name: "tran_status",options: { display: 'excluded' }},
        {name: "tran_type",options: { display: 'excluded' }},
        {name: "tran_amount",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "tran_code",label: "Transaction code",options: {filter: true,sort: true}},
        {name: "tran_type",label: "Transaction type",options: {filter: true,sort: true}},
        {name: "tran_note",label: "Note",options: {filter: true,sort: true}},
        {name: "tran_created_isodt",label: "date time",options: {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[8]).format(dateTimeFormat) }</p>) 
          }
        }
        
      },
        {name: "tran_amount",label: "Amount",options: {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
           return ( <p>{tableMeta.rowData[3]}</p> ); 
        }}},
     
     
        {name:"actions",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
            return ( <ActionOptions   value={value} rowIndex={tableMeta.rowIndex}  rowData={tableMeta.rowData} 
               /> ); 
        }
        },headerStyle: {
          textAlign:'right'
        }}
       ];
              
       const options = {
         filterType: 'checkbox',
         selectableRows: 'none',
         display: "excluded"
        }

    return (
        <div className={classes.root}>
             {/* Success message */}
              <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  {successMsg.msg}
                </Alert>
              </Snackbar>  
              {/* End of message */}
            <Paper className={classes.paper} style={{marginTop:'-15px'}}> 
            <h2 className={classes.pageEntryLabel}> Cash Deposit / Withdraw Entry</h2> 

            <Grid container spacing={2}> 
            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={tran_code} 
            name="tran_code" style={{color:'#222'}} disabled variant="outlined" size="small"  

            />
            </Grid>

            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                  
                <Autocomplete
                style={{ width: '100%' }}
                options={tranTypes}
                size="small"
                classes={{
                    option: classes.option
                }}
                autoHighlight={true}
                openOnFocus={true}
                getOptionLabel={(option) => option.tran_type}
                value={selectedTranType} 
                onChange={(event,selectedObj)=>{
                  selectedTranTypeSet(selectedObj)
                }}
                loading={tranTypes.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={bankTranTypeRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            bankTranDateRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a transaction type"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {bankTranAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                    }}
                    />
                )}
                /> 
            </Grid>
          
            
            <Grid item xs={12} sm={3}  > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
          
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '-8px' }}
             inputRef={bankTranDateRef}
             onKeyDown={event => {
                 if (event.key === "Enter") {
                   bankTranNoteRef.current.focus()
                 }
               }}
        value={selectedDate}
        onChange={handleDateChange}
        label="Entry date  time"
        format="yyyy/MM/dd hh:mm a"
      />
    </MuiPickersUtilsProvider>
</Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={tran_note} 
            label="Transaction note" name="tran_note" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>tran_note_set(e.target.value)} 
            inputRef={bankTranNoteRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  bankTranAmountRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField type="number"  autoComplete='off'  className={classes.fullWidth}  value={tran_amount} 
            label="Transaction amount" name="tran_amount" style={{color:'#222'}}  variant="outlined" size="small" onChange={(e)=>tran_amount_set(e.target.value)}
            inputRef={bankTranAmountRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  bankTranActionRef.current.click()
                }
              }}
            />
            </Grid>
           
           </Grid>
           
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            buttonRef={bankTranActionRef}
            className={classes.button}
            startIcon={<SaveIcon/>}
            disabled={loadingSave}
            onClick={saveFormAction}
        >
        Save
      </Button>
  </Grid>
            </Paper>
            {
      loadingList==true?(<b>Loading...</b>):(
        <Paper className={classes.paper} style={{marginTop:'20px'}}>
        <MUIDataTable
      title={"Cash Deposit / Withdraw Transaction List"}
      data={trans}
      columns={columns}
      options={options}
      adjustForCheckbox={false} 
      displaySelectAll={false}
      />
      </Paper>
      )
      
     }


     
        </div>
    )
}



const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  root: {},
  '& .MuiTextField-root': {
    margin: theme.spacing(1),
    width: '25ch',
   },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    pageEntryLabel:{
        color: '#7754cc',
        margin: '0px',
        padding: '0px',
        marginTop: '-11px',
        textAlign: 'left',
        marginLeft: '0px',
        marginBottom: '5px',
        textAlign:'left'
    },
    fullWidth:{
        width:'100%'
    },
    option: {
        fontSize: 15,
        '& > span': {
          marginRight: 10,
          fontSize: 18,
        },
      },
      plusLinkDiv:{
            position:'relative'  
      },
      plusLink:{
        margin: 0,
        padding: 0,
        marginTop: '-21px',
        fontSize: '29px',
        height: '21px',
        textAlign: 'right',
        position: 'absolute',
        right: 0,
        color: '#3e8d54'
      }
  }));
  
  const mapStateToPops = (state)=>{
        return {
          currentRoute:state.currentRouteReducer,
          authInfo:state.authInfoReducer,
      
        }
  }
  export default connect(mapStateToPops,{currentRouteSet})(BankTransManage);