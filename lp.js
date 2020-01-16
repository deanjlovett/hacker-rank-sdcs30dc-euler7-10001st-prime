'use strict';

const fs = require('fs');

///////////////////////////////////////
// djl
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const defaultFileName='sample_input.txt'
let fileName = defaultFileName;

const optionDefinitions = [
  { name: 'help',     alias:'h', type: Boolean, defaultOption: false, description: 'Display this usage guide.' },
  { name: 'create',   alias:'c', type: Boolean, description: `Create a sample input file: ${defaultFileName}` },
  { name: 'input',    alias:'i', type: String, defaultOption: true, typeLabel: '{underline file}', description: 'The data input file.' },
  //{ name: 'force',    alias:'f', type: Boolean, description: 'Attempt to run even if the input data has errors.' },
  { name: 'verbose',  alias:'v', type: Boolean, description: 'Display a bit more information as program runs.' },
  { name: 'debug',    alias:'d', type: Boolean, description: 'Display debug info as program runs.' },
  { name: 'quiet',    alias:'q', type: Boolean, description: 'Display result without any additional information.  Takes precidence over the verbaose flag.' },  
];
const options = commandLineArgs(optionDefinitions);

let sampleInputFileContent = 
'6' + '\n' +
'1' + '\n' +
'2' + '\n' +
'3' + '\n' +
'98' + '\n' +
'99' + '\n' +
'100' + '\n' +
'\n'
;

let contentNote = `If no input file name is given,\nthen app will try to open this file: ${defaultFileName}`;
const usage = commandLineUsage([
  { header: 'sample javascript arg processing app',
    content:  'An arg handling example\n\n'+
              'Blah blah blah, yadda yadda yadda.' },
  { header: 'Options', optionList: optionDefinitions },
  { header: 'Note', content: contentNote },
  { header: 'Example input file format', content: sampleInputFileContent}
]);

if( options['help']){
  console.log(usage);
  return 0;
}

let _quiet = false;
if( options['quiet']) {
  _quiet = true;
}

let _verbose = false;
if( options['verbose'] ) {
  _verbose = true;
}

let _debug = false;
if( options['debug'] ) {
  _debug = true;
}

let _force = false;
if( options['force'] ) {
  _force = true;
}

let _create = false
if( options['create'] ) {
  _create = true;
}

if(_verbose){
  verboselog(
    '\n'+'******************************'+
    '\n'+'***                        ***'+
    '\n'+'***  be annoyingly chatty  ***'+
    '\n'+'***                        ***'+
    '\n'+'***  when you think of it. ***'+
    '\n'+'***                        ***'+
    '\n'+'******************************'+
    '\n'
  );
}

if( _create ) {
  try{
    if (fs.existsSync(fileName)) {
      verboselog('');
      verboselog(`Cannot create a new file: ${fileName}`);
      verboselog('That file already exists.')
      verboselog('');
      verboselog('Now using that data file.');
      verboselog('');
    }
    else{
      fs.writeFileSync(fileName, sampleInputFileContent);

      verboselog(`Create a new input file: ${fileName}`);
      verboselog('That file has the following content:')
      verboselog('');
      verboselog(sampleInputFileContent);
      verboselog('');
      verboselog('Now using that data file.');
      verboselog('');
    }
  }
  catch(err){
    verboselog(err);
    return 2;
  }
}
else if( options['input'] ){ // ignore --input if they used --create
  fileName = options['input'];
  verboselog('');
  verboselog(`Using an input file: ${fileName}`);
  verboselog('');
}

try{
  if (!fs.existsSync(fileName)) {
    verboselog('');
    verboselog(`Cannot open input data file: ${fileName}`);
    verboselog('That file does not exist.')
    verboselog('');
    if( fileName == defaultFileName){
      verboselog('Run again with the arg: \'-c\'');
      verboselog(`to create a new sample input file: ${fileName}`);
      verboselog('');  
      verboselog('Run again with the arg: \'-h\' or --help');
      verboselog('for a more complete list of command line options.');
      verboselog('');  
    }
    return 3;
  }
}
catch(err){
  verboselog(err);
  return 4;
}

function verboselog(...args){
  if(!_quiet) console.log(...args);
}

/**
 * Prints out args to screen if debug is true
 * 
 * @param {...any}  args    almost any number of args
 *
 * @return nothing
 *         
 */

function debugLog(...args) {
  if(_debug) console.log(...args);
}

// djl
///////////////////////////////////////

process.stdin.resume();
process.stdin.setEncoding('ascii');

var input_stdin = "";
var input_stdin_array = "";
var input_currentline = 0;

if( options['input'] || _create || _verbose || _quiet ){
  let inputData = fs.readFileSync(fileName,'utf-8');
  input_stdin_array = inputData.split('\n');
  verboselog(input_stdin_array);
  main();
  return 0;
}
else {
  process.stdin.on('data', function (data) {
      input_stdin += data;
  });
  
  process.stdin.on('end', function () {
      input_stdin_array = input_stdin.split("\n");
      main();    
  });
}

function readLine() {
    return input_stdin_array[input_currentline++];
}
/////////////// ignore above this line ////////////////////

function main() {
    let t = parseInt(readLine());
    let ar=[];
    for(let i = 0; i < t; ++i){
        ar.push( parseInt(readLine(),10) );
    }
    let ars = [...ar];
    ars.sort((a,b)=>a-b);
    console.log('count:',t,'size ar:',ars.length,'ar:',ar,'ars:',ars);
    //    let p=[2,3];
    let p=[2,3,5,7,11,13,17,19,23,29];

    let skip3=[2,4];
    let skip5=[2,6,4,2,4,2,4,6]
    let maxp = p[p.length-1];
    let pc = p.length;
    let maxn = ars[ars.length-1];
    let i=maxp+2;
    let stop=Math.ceil( Math.sqrt(i))+1;
    // console.log('maxn:',maxn,'maxp',maxp,'i:',i,'stop:',stop);
    let k=0;
//    for( ; p.length<maxn; i+=2                  ) {
//    for( ; p.length<maxn; k=(k+1)%2,i+=skip3[k] ) {
    for( ; p.length<maxn; k=(k+1)%8, i+=skip5[k] ) {
        stop = Math.ceil( Math.sqrt(i) ) + 1;
        //console.log('p.length:',p.length,'maxp:',maxp,'i:',i,'k:',k,'skip5[k]:',skip5[k],'stop:',stop);
        let isPrime = true;
        for(let j=1; p[j]<=stop;++j ){        
            //  console.log('  j:',j,'p[j]:',p[j],'stop:',stop);
            if((  i % p[j])=== 0 ){
                //  console.log('    not prime: ','i:',i,'j:',j,'p[j]:',p[j]);
                isPrime = false;
                break;
            }
        }
        if( isPrime ){
            //  console.log('        prime: ','i:',i);
            p.push(i);
            ++pc;
            maxp= i;
        }
        // console.log('p:',p);
    }
    //console.log('p:',p);

    for( let j=0; j<ar.length; ++j){
        console.log(p[ar[j]-1]);
    }
}