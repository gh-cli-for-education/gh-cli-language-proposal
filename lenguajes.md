## https://github.com/cli/go-gh

Go library for the GitHub CLI.
go-gh is a collection of Go modules to make authoring GitHub CLI extensions easier.

## https://pkg.go.dev/github.com/github/gh-cli

gh - The GitHub CLI tool

The #ce-cli team is working on a publicly available CLI tool to reduce the friction between GitHub and one's local machine for people who use the command line primarily to interact with Git and GitHub. 

https://github.com/github/releases/issues/659

This tool is an endeavor separate from github/hub, which acts as a proxy to git, 
since our aim is to reimagine from scratch the kind of command line interface to GitHub that 
would serve our users' interests best

https://github.com/cli/cli

## ChatGPT

### Q

Can you design a language (a DSL) on top of GitHub cli (gh) to easy the interaction with github?

### A

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

### Q

Can you give me an example of how to express in such a DSL something like "print the name of the github organizations I belong to" 

### A

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

## File get-orgs.gh

```ruby
def(myOrgs, fun(
  ( # print the github organizations for the user
      def(orgs, api(
       paginate: true,
       route: "/users/mememberships/orgs",
       jq: jq(`
            [
              .[].organization
              | { name: .login, url: .url  }
            ]`
          )
        )
      ),
      orgs.forEach(fun(o) {
        print(`name: ${o.name}, url: ${o.url})
      })
  )
)
```

## File get-teams.gh

```js
(
  def(arg,process.argv[2]),
  if(arg, def(ORG, arg), def(ORG, "ULL-ESIT-PL-2223")), 
  def(TEAMS,org-teams({ORG: ORG),
  print(TEAMS)
)
```

