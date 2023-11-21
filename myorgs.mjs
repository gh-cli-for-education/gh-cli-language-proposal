import { api } from "github-cli";
let orgs = api({
    paginate: true,
    route: "/users/mememberships/orgs",
    jq: `
          [
            .[].organization
            | { name: .login, url: .url  }
          ]`
}) 
orgs.forEach(o => console.log(`name: ${o.name}, url: ${o.url}`))