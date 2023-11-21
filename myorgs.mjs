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