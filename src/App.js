import {Table, Container, Button, Form } from 'react-bootstrap';
import React from 'react';
import { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import './main.js';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
// import logo from '../public/img/FileHub-logos_white.png';
var CryptoJS = require("crypto-js");
//import detectEthereumProvider from '@metamask/detect-provider';

class App extends Component {
 
  state = {
    ipfsHash:null,
    buffer:'',
    ethAddress:'',
    blockNumber:'',
    transactionHash:'',
    gasUsed:'',
    txReceipt: ''   
  };
 
  captureFile =(event) => {
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)    
    };

  convertToBuffer = async(reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS
      const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
      this.setState({buffer});
  };

  onClick = async () => {

  try{
      this.setState({blockNumber:"waiting.."});
      this.setState({gasUsed:"waiting..."});

      // get Transaction Receipt in console on click
      // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
        console.log(err,txReceipt);
        this.setState({txReceipt});
      }); //await for getTransactionReceipt

      await this.setState({blockNumber: this.state.txReceipt.blockNumber});
      await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
    } //try
  catch(error){
      console.log(error);
    } //catch
} //onClick

  handleChange = async (event) => {
    this.setState({value: event.target.value});
    //var recEmail = this.state.value;
  }
  
  handleChange2 = async (event) => {
    this.setState({enchash: event.target.value});
    // this.setState({encEmail: event.target.value});
    
  }

  handleChange3 = async (event) => {
    // this.setState({enchash: event.target.value});
    this.setState({encEmail: event.target.value});
    
  }

  onSubmit2 = async (event) => {
    event.preventDefault();
    const echash = this.state.enchash;
    const recEmail = this.state.encEmail;

    console.log("encrpted", echash);
    console.log("email", recEmail);

    //Decryption
        var bytes = CryptoJS.AES.decrypt(echash, recEmail);
        var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        console.log("decryptedText", decryptedData);
        this.setState({decryptedData});
        var website = 'https://gateway.ipfs.io/ipfs/' + decryptedData;
        console.log({website});
        this.setState({website});

    return (
      <div>
          <h3>Link to File</h3>
          'https://gateway.ipfs.io/ipfs/' + {this.state.decryptedData}
      </div>
    )
  }

  onSubmit = async (event) => {
      event.preventDefault();

      const accounts = await window.ethereum.enable();

      const account = accounts[0];
      // const gas = await storehash.methods.sendHash( this.state.ipfsHash ).estimateGas();
      //Set recepient's email
      
      const recEmail = this.state.value; 
      alert('Recepient Email: ' + recEmail );
    
    //bring in user's metamask account address
    // const accounts = await web3.eth.getAccounts();
   
    // console.log('Sending from Metamask account: ' + accounts[0]);

    //obtain contract address from storehash.js
    const ethAddress= await storehash.options.address;
    this.setState({ethAddress});

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
      await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ ipfsHash:ipfsHash[0].hash });

        //Encryption
        const ipfsHashOG = this.state.ipfsHash;
        var ciphertext = CryptoJS.AES.encrypt(ipfsHashOG, recEmail);
        var encryptedText = ciphertext.toString();
        console.log("encryptedText", ciphertext.toString());
        this.setState({encryptedText});
        
        // Decryption
        var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), recEmail);
        var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted text", decryptedData);

        // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
        //return the transaction hash from the ethereum contract
        //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
        storehash.methods.sendHash( ciphertext.toString() ).send({
          from:account}, (error, transactionHash) => {
            console.log(transactionHash);
            this.setState({transactionHash});
          })

        // console.log(result);


      
        // storehash.methods.sendHash(this.state.ipfsHash).send({
        //   from: {addr} 
        // }, (error, transactionHash) => {
        //   console.log(transactionHash);
        //   this.setState({transactionHash});
        // }); //storehash 
      }) //await ipfs.add 
    }; //onSubmit 

  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <div className="Logo">
            {/* <img src="/img/FileHub-logos_white.png" alt="FileHub"/> */}
            {/* <img src="/img/FileHub-logos_transparent.png" alt="FileHub" alt=""/> */}

          </div>
          <div className="Title"><h1> FileHub</h1></div>
          <div className="TagLine"><h3> Securely Share files. With the power of IPFS</h3></div>
        </header>
        
        
        <hr />

        <section class="tabs">
        <div class="container">
            <div id="tab-1" class="tab-item tab-border">
                
                <p class="hide-sm">Send File</p>
            </div>
            
          </div>
          </section>

        
      <section className="tab-content">
      <div className="container">
      <section id="tab-1-content" className="tab-content-item show">
        <h2> Choose file to send to IPFS </h2>
        <Form onSubmit={this.onSubmit} className="form-1">
          <label for="custom-file" className="file-upload">Upload File: 
          <input
            id="custom-file"
            type = "file"
            onChange = {this.captureFile}
          /></label>
          {/* Enter the email of the recepient */}
            <label for="email" className="recepientEmail">
              Recepient's Email:
            <input id="email" type="text" value={this.state.value} onChange={(this.handleChange)} />
            </label>
            {/* <input type="submit" value="Submit" /> */}
           <Button className="btn-md"
           bsStyle="primary" 
           type="submit"> 
           Send it 
           </Button>
        </Form>

          <div className="padding">
          <Button onClick = {this.onClick} className="btn"> Get Transaction Receipt </Button>
          </div>
            <Table class="table" bordered responsive>
              <thead>
                <tr>
                  <th>Tx Receipt Category</th>
                  <th>Values</th>
                </tr>
              </thead>
             
              <tbody>
                <tr>
                  <td>IPFS Hash #</td>
                  <td>{this.state.ipfsHash}</td>
                </tr>
                <tr>
                    <td>
                      Encrypted IPFS Hash # stored on Eth Contract
                    </td>
                    <td>
                        {this.state.encryptedText}
                    </td>
                </tr>
                <tr>
                  <td>Ethereum Contract Address</td>
                  <td>{this.state.ethAddress}</td>
                </tr>

                <tr>
                  <td>Tx Hash # </td>
                  <td>{this.state.transactionHash}</td>
                </tr>

                <tr>
                  <td>Block Number # </td>
                  <td>{this.state.blockNumber}</td>
                </tr>

                <tr>
                  <td>Gas Used</td>
                  <td>{this.state.gasUsed}</td>
                </tr>                
              </tbody>
          </Table>
          <hr />
      </section>

      <section class="tabs">
        <div class="container">
            <div id="tab-2" class="tab-item tab-border">
                
                <p class="hide-sm">View File</p>
            </div>
            
          </div>
          </section>

      <section id="tab-2-content" className="tab-content-item">
          <div>
              <h3>Enter the encrypetd hash to view the File</h3>
              <Form onSubmit={this.onSubmit2}>
                  {/* Enter the Encrypted hash */}
            <label>
              Encrypted Hash:
            <input type="text" value={this.state.enchash} onChange={(this.handleChange2)} />
            </label>
            <label>
              Email:
            <input type="text" value={this.state.encEmail} onChange={(this.handleChange3)} />
            </label>
            {/* <input type="submit" value="Submit" /> */}
           <Button className="btn"
           bsStyle="primary" 
           type="submit"> 
           Send it 
           </Button>
              </Form>
          </div>

      </section>
      </div>
      </section>
      <section className="container-3">
          <table>
            <tbody>
                <tr>
                  <td>Website to view file: </td>
                  <td>{this.state.website}</td>
                </tr>
            </tbody>
          </table>
      </section>
      <footer className= "footer">
        <div class="copyright">Designed and  Created by</div>
        <div class="copyright">Onkar Bharatesh &#169; All Rights Reserved</div>
      </footer>
   </div>
    );
  } //render
}

export default App;        