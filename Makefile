build-page:
	git branch -D gh-pages
	git checkout --orphan gh-pages
	sed -i.bak 's/\.\.\/vendor/public/g' examples/index.html
	sed -i.bak 's/\.\.\///g' examples/index.html
	sed -i.bak 's/\.\.\/vendor/public/g' examples/view.html
	sed -i.bak 's/\.\.\///g' examples/view.html
	cp examples/* .
	mkdir public
	cp -R vendor/* public

	rm *.bak
	git add . -A
	git commit -m 'Building gh-pages branch'
	git push origin gh-pages --force
	rm -rf public
	git checkout master