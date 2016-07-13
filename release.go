package main

import (
	"github.com/flowcommerce/tools/executor"
)

func main() {
	executor := executor.Create("lib-apidoc")
	executor = executor.Add("git checkout master")
	executor = executor.Add("git pull origin master")
	executor = executor.Add("dev tag --label micro")
	executor = executor.Add("npm version --no-git-tag-version `sem-info tag latest`")
	executor = executor.Add("git add package.json")
	executor = executor.Add("git commit -m 'autocommit: package.json'")
	executor = executor.Add("git push origin master")
	executor = executor.Add("npm publish")
	executor.Run()
}
