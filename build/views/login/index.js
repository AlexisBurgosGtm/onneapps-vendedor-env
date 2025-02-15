function getView(){
    let view = {
        login : ()=>{
            return `
        <div class="row">
     
            <div class="col-md-4 col-sm-12 col-lg-4 col-lx-4">
                
            </div>

            <div class="col-md-4 col-sm-12 col-lg-4 col-lx-4">
   
                <div class="card shadow p-2 border-top-rounded border-bottom-rounded">

                    <div class="card-header text-center bg-white">
                        <img src="./favicon.png" width=60 height=60>
                    </div>
                    <div class="card-body">
                            
                        <form class="" id="frmLogin" autocomplete="off">
                            <div class="form-group">
                                <select class="negrita form-control border-secondary border-top-0 border-right-0 border-left-0" id="cmbSucursal">
                                    
                                </select>
                                
                            </div>
                            <div class="form-group">
                                
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-user"></i>
                                        </span>
                                    </div>
                                    <input class="form-control border-secondary border-top-0 border-right-0 border-left-0" type="text" id="txtUser" placeholder="Escriba su usuario" required="true">
                                </div>
                                
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-lock"></i>
                                        </span>
                                    </div>
                                    <input class="form-control border-secondary border-top-0 border-right-0 border-left-0" type="password" id="txtPass" placeholder="Escriba su contraseña" required="true">
                                </div>
                                        
                            </div>
                            <br>
                            <div class="form-group" align="center">
                                <button class="btn btn-secondary btn-lg shadow col-12 btn-rounded"  type="submit" id="btnIniciar">
                                    <i class="fal fa-unlock"></i>
                                    Ingresar
                                </button>
                            </div>
                            <div class="form-group" align="right">
                                <small class=""></small>
                                <br>
                                <small>
                                    por Alexis Burgos (${versionApp})
                                </small>
                            </div>
                        </form>
                    </div>

                
    

                </div>
            </div>

            <div class="col-md-4 col-sm-12 col-lg-4 col-lx-4"></div>

            
     
            `
        }
    };

    root.innerHTML = view.login();
};



function addListeners(){
    

    
    
    get_empresa()
    .then((data)=>{
        console.log('uno')
        console.log(data);

        document.getElementById('cmbSucursal').innerHTML = `<option value='${data[0].toString()}'>${data[1].toString()}</option>`; 
    })
    .catch((err)=>{
        console.log('dos')
        console.log(err)

        funciones.AvisoError('No se cargo la empresa')
    })


    
    let btnIniciar = document.getElementById('btnIniciar');
    frmLogin.addEventListener('submit',(e)=>{
        e.preventDefault();

        almacenarCredenciales();

        btnIniciar.innerHTML = '<i class="fal fa-unlock fa-spin"></i>';
        btnIniciar.disabled = true;
        apigen.empleadosLogin(frmLogin.cmbSucursal.value,frmLogin.txtUser.value,frmLogin.txtPass.value)
        .then(()=>{
            //obtiene la fecha de la última actualización de productos
            selectDateDownload();
            //document.body.requestFullscreen();
            //por lo visto se deshabilitan las scroll bars en fullscreen
        })
        .catch(()=>{
            btnIniciar.disabled = false;
            btnIniciar.innerHTML = '<i class="fal fa-unlock"></i>Ingresar'
        });
    });



    
 
};


function InicializarVista(){
   getView();
   addListeners();

   //getCredenciales();
  
};


function getEmpresasToken(token){

    return new Promise((resolve,reject)=>{
        axios.post('/usuarios/empresas', {
            token:token
        })
        .then((response) => {
            
            const data = response.data;
            if(Number(data.rowsAffected[0])>0){
                resolve(data);             
            }else{
                reject();
            }
          
        }, (error) => {
            //funciones.AvisoError('Error en la solicitud');
            reject();
        });
    })

};


async function almacenarCredenciales(){
    const cred = new PasswordCredential({
        id: document.getElementById('txtUser').value,
        name: document.getElementById('cmbSucursal').value,
        password: document.getElementById('txtPass').value,
        token: document.getElementById('txtToken').value
    })

    await navigator.credentials.store(cred)

};

function getCredenciales(){
   if ('credentials' in navigator) {
        navigator.credentials.get({password: true})
        .then(function(creds) {
            //Do something with the credentials.
            document.getElementById('txtUser').value = creds.id;
            document.getElementById('cmbSucursal').value = creds.name;
            document.getElementById('txtPass').value = creds.password;
        });
    } else {
    //Handle sign-in the way you did before.
    };
};





function get_empresa(){
    return new Promise((resolve,reject)=>{
        axios.get('/get_empresa')
        .then((response) => {
         
            let data = response.data
           resolve(data); 

        }, (error) => {
        
            reject(error);
        });
    })
}