//Compile to .bat made by a.bakedpotato
const fs = require('fs');

function add(line){
	fs.writeFileSync('./output.bat', fs.readFileSync('./output.bat').toString()+'\n'+line);
}

function readdir(path){
	for (let file of fs.readdirSync(path)){
		if (fs.lstatSync(path+'/'+file).isDirectory()){
			add('mkdir "'+file+'"');
			add('cd "'+file+'"');
			readdir(path+'/'+file);
			add('cd ..');
		} else {
			let data = fs.readFileSync(path+'/'+file).toString().split('\r\n');
			for (let line of data){
				if (line.replace(/\t/g, '') === '') add('echo. >> "'+file+'"');
				else add('echo '+line
						.replace(/>/g, '^>')
						.replace(/&/g, '^&')
						.replace(/\|/g, '^|')
						.replace(/</g, '^<')
						.replace(/%/g, '^%')
						+((parseInt(line.slice(-1)) !== NaN) ? ' ':'')
						+'>> "'+file+'"');
			}
		}
	}
}

fs.writeFileSync('./output.bat', '@echo off');
readdir('./input');

//Only for bot template
add('npm init');
add('install.bat');