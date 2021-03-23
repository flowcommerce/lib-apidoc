package main

import (
	"github.com/flowcommerce/tools/executor"
)

func main() {
	executor := executor.Create("lib-apidoc")
	executor = executor.Add("git checkout main")
	executor = executor.Add("git pull origin main")
	executor = executor.Add("dev tag --label micro")
	executor = executor.Add("git add package.json")
	executor = executor.Add("git push origin main")
	executor = executor.Add("npm publish")
	executor.Run()
}
