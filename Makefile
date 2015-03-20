build-page:
	git branch -D gh-pages
	git checkout --orphan gh-pages
	cp examples/* .
	mkdir public
	cp -R vendor/* public
	for HTML in $(find . -type f -name "*.html")
	do
		sed -i.bak 's/\.\.\/vendor/public/g' $HTML
		sed -i.bak 's/\.\.\///g' $HTML
	done
	rm *.bak
	git add . -A
	git commit -m 'Building gh-pages branch'
	git push origin gh-pages --force
	rm -rf public
	git checkout master