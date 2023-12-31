# Design and implement a language (a DSL) built on top of GitHub cli (gh) to easy the interaction with github

## ChatGPT Proposal

### Q1

Can you design a language (a DSL) on top of GitHub cli (gh) to easy the interaction with github?

### A1

Certainly! I can help you design a Domain-Specific Language (DSL) on top of the GitHub CLI (gh) to simplify interactions with GitHub. The DSL will provide a more intuitive and concise syntax for common GitHub operations. Here's a basic outline of how you can design the DSL:

1. Define the syntax: The first step is to determine the syntax and structure of the DSL. You'll need to choose keywords and constructs that make sense in the context of GitHub operations. For example, you might use verbs like `create`, `clone`, `commit`, `push`, `pull`, `merge`, `issue`, `pr`, etc.

2. Map DSL commands to gh commands: Once you have the syntax defined, you need to map each DSL command to the corresponding gh command. 
gh provides a wide range of commands to interact with GitHub, such as 

`gh repo create`, 
`gh issue create`, 
`gh pr create`, 
`gh pr merge`, etc. 

You'll need to map the DSL commands to their respective gh commands and pass any necessary arguments or options.

3. Handle command chaining and sequencing: 

DSLs often allow chaining multiple commands together to create a sequence of actions. 
For example, you might want 
1. to clone a repository, 
2. create a branch, 
3. make some changes, 
4. commit them, and 
5. push to the remote repository. 

Think about how you can represent and handle such sequences in your DSL.

4. Handle command parameters and options: 

  Some gh commands require additional parameters or options. 
  Decide how you want to handle these in your DSL:
  - You can either allow users to provide them as arguments within the DSL syntax or 
  - use some form of configuration files to specify them.

5. Error handling and feedback: 
   
   Consider how you want to handle errors and provide feedback to the user. 
   You can leverage the output and error handling mechanisms provided by gh to display meaningful messages to the user in case of errors or successful operations.

6. Implement the DSL: 
  
  Based on the design decisions made in the previous steps, you'll need to implement the DSL using a programming language of your choice. You can use a parser or a lexer to process the DSL commands and translate them into gh commands.

7. Testing and refinement: 

  Test the DSL thoroughly with various scenarios and ensure it behaves as expected. Make any necessary refinements or improvements based on user feedback or requirements.

It's important to note that creating a DSL can be a complex task, and 
depending on your familiarity with programming languages and parsing techniques, 
the implementation can vary. You might need to leverage existing parser generators 
or libraries to simplify the DSL implementation process.

Remember to refer to the official documentation of gh and explore its capabilities 
to ensure you leverage its full potential within your DSL.

### Q2

Can you give me an example of how to express in such a DSL something like "print the name of the github organizations I belong to" 

### A2

Certainly! Here's an example of how you can express the task "print the name of the GitHub organizations I belong to" using a DSL on top of the GitHub CLI (gh):

DSL Command: **list my organizations**

In this example, we define a DSL command list my organizations to retrieve and print the names of the GitHub organizations the user belongs to.

Under the hood, the DSL command list my organizations will be mapped to the corresponding gh command gh api user/orgs, which retrieves the list of organizations for the authenticated user.

Here's a potential implementation in a DSL framework:

```
command list my organizations {
  run {
    let organizations = gh api user/orgs
    for org in organizations {
      print(org.name)
    }
  }
}
```

In the above DSL code snippet, we define a command list my organizations. The run block executes the corresponding gh command gh api user/orgs, which retrieves the organizations for the authenticated user. We then iterate over each organization and print its name using the print statement.

To execute the DSL command, you would run the corresponding DSL interpreter or compiler, which would process the DSL code and execute the underlying gh commands.

Please note that the above example is a simplified representation of the DSL command and its implementation. Depending on the specific DSL framework or language you choose, the syntax and implementation details may vary.

## Writing a npm module to wrap gh

See [myorgs.mjs](myorgs.mjs)

```js
import { api } from "github-cli";

try {
    let orgs = api({
        paginate: true,
        jq: `
          [
            .[].organization
            | { name: .login, url }
          ]`,
        endpoint: "/users/memberships/orgs",
    })
    /* 
    This call returns an object with the stdout, stderr and exit code resulting of executing the command 
    gh api --paginate  --jq '[.[].organization | { name: .login, url }]' /user/memberships/orgs
    */
    orgs = JSON.parse(orgs.stdout)
    orgs.forEach(o => console.log(`name: ${o.name}, url: ${o.url}`))
}
catch (e) {
    console.log(e)
}
/* Output:
[
  {
    "name": "etsii2", "url": "https://api.github.com/orgs/etsii2"
  },
  {
    "name": "ULL-ETSII-GRADO-SYTW-1314", "url": "https://api.github.com/orgs/ULL-ETSII-GRADO-SYTW-1314"
  },
  ...
]
*/
```

## REPL

A wrap around the node REPL:

```
$ node
let {gh, sh} = require("./github-cli.mjs")
> gh.graphql() /* opens the github page of the graphql explorer */
> gh.api.help()
/* will show the help of the api command */
> api = gh.api
> let command = api({i: true})
/* will ask you for each of the parameters of the api command 
and show the resulting gh command*/
> sh(command) // will execute the command in the shell
```

## Proposal for PL  students: Extending Egg with github gh DSL

### Example File get-orgs.gh

This is a "list my orgs" example that maps directly to the `gh api` command:

```ruby
def(myOrgs, fun(
    do( # print the github organizations for the user
        def(orgs, gh-api(
        paginate: true,
        route: "/users/mememberships/orgs",
        jq: jq(`
              [
                .[].organization
                | { name: .login, url: .url  }
              ]`
            ) # end jq
          ) # gh-api 
        ), # def
        orgs.forEach(fun(o,
            print(`name: ${o.name}, url: ${o.url})
          ) # end fun
        ) # end forEach
    ) # end do
  ) # end fun
) # end def myOrgs
```

```js
myOrgs =  fun {
  orgs = api({
    paginate: true,
    route: "/users/mememberships/orgs",
    jq: jq(`
              [
                .[].organization
                | { name: .login, url: .url  }
              ]`
        ) // end jq
    }) // end api 
    orgs.forEach(fun(o) {
      print(`name: ${o.name}, url: ${o.url})
    })
  } 
} # end def myOrgs
```

### Example File get-teams.gh

Assumes gh-extension [org-teams](https://github.com/gh-cli-for-education/gh-org-teams) is installed as run-time library and mapped to a function in Egg with the same name 

```js
do(
  def(teams, gh-org-teams({ORG: ORG})),
  =(teams, jq('.data.organization.teams.edges[].node', teams),
  teams.forEach(fun(t) {
    print(`name: ${t.name}, url: ${t.url})
  })
)
```

## References


### gh - The GitHub CLI tool

See https://github.com/cli/cli

See also https://pkg.go.dev/github.com/github/gh-cli

The GitHub cli team is working on a publicly available CLI tool to reduce the friction between GitHub and one's local machine for people who use the command line primarily to interact with Git and GitHub. 

See https://github.com/github/releases/issues/659

This tool is an endeavor separate from github/hub, which acts as a proxy to git, 
since our aim is to reimagine from scratch the kind of command line interface to GitHub that 
would serve our users' interests best

### https://github.com/cli/go-gh

Go library for the GitHub CLI.

go-gh is a collection of Go modules to make authoring GitHub CLI extensions easier.

### Example of "use" in Egg

See [Strategy Pattern: use](https://ull-esit-pl-2122.github.io/practicas/tfa.html#strategy-pattern-use) in the PL TFA

### jq

* <https://github.com/fadado/JBOL/blob/master/doc/JQ-language-grammar.md> a grammar for jq
  