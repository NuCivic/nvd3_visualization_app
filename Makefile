build-page:
        version = "0.1.0"
	git branch -D gh-pages-version
	git checkout --orphan gh-pages-version
	sed -i.bak 's/\.\.\/vendor/public/g' examples/index.html
	sed -i.bak 's/\.\.\///g' examples/index.html
	sed -i.bak 's/\.\.\/vendor/public/g' examples/view.html
	sed -i.bak 's/\.\.\///g' examples/view.html
	mkdir $(version)
	cp examples/* $(version)
	mkdir $(version)/public
	cp -R vendor/* $(version)/public

	rm *.bak
	git add . -A
	git commit -m 'Building gh-pages branch'
	git push origin gh-pages-version --force
	rm -rf public
	git checkout master
