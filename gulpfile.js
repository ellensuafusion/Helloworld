var gulp = require('gulp'),
    args = require('yargs').argv,
    exec = require('child_process').execSync,
    log = require('fancy-log');

gulp.task('BuildDockerImage',function(){
	exec('cat pwd.txt | docker login --username adamkomuro --password-stdin');
	exec('docker build -f Dockerfile -t adamkomuro/nginxweb:' + args.buildversion +' -t adamkomuro/nginxweb:latest --rm --no-cache .', function (err,outlog,errlog){
		console.log(outlog);
		console.log(errlog);
	});
})

gulp.task('PushImage',['BuildDockerImage'],function(){
	exec('docker push adamkomuro/nginxweb:' + args.buildversion, function (err,outlog,errlog){
		console.log(outlog);
		console.log(errlog);
	});
	exec('docker push adamkomuro/nginxweb:latest', function (err,outlog,errlog){
		console.log(outlog);
		console.log(errlog);
	});
})
//這段是for play-with-docker特別寫的 與實際server ssh不同
gulp.task('SSHServer',['PushImage'],function() {
	exec('ssh ip172-18-0-6-bah22s8o6i4000bn3vv0@direct.labs.play-with-docker.com -Y -tt');
})

gulp.task('UpdateDockerCompose',['SSHServer'],function() {;
	exec('docker-compose pull web','docker-compose up -d --no-deps --build web');
})

gulp.task('Deploy.stg',['UpdateDockerCompose']);
