build-release:
	rm -rf build 
	mkdir build  
	VERSION=`node -pe "require('./package.json').version"` && \
	browserify src/flare-codec.js -t [ envify purge --MODE global ] | \
	tee  build/flare-codec-"$$VERSION".js | \
	babel --presets es2015 | \
	uglifyjs - -o build/flare-codec-"$$VERSION".min.js
	
	

	
