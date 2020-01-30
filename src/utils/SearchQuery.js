export const searchQuery = `
    query search($queryString: String! ) {
        search(queryString: $queryString){
            __typename
            ... on CommandCenter {
                id
                shortTitle
            }
            ... on Compliance {
                id
                name
            }
            ... on ComplianceCriterion {
                id
                name
            }
            ... on Contact {
                id
                name
            }
            ... on DataSource {
                id
                name
            }
            ... on DataSourceType {
                id
                name
            }
            ... on FileWrapper {
                id
                name
            }
            ... on DIR {
                id
                name
            }
            ... on Document {
                id
                name
            }
            ... on Glossary {
                id
                term
            }
            ... on JMET {
                id
                name
            }
            ... on Network {
                id
                name
            }
            ... on Org {
                id
                name
            }
            ... on Reference {
                id
                shortTitle
            }
            ... on Requirement {
                id
                name
            }
            ... on RequirementOrgType {
                id
                name
            }
            ... on ServiceCatalog {
                id
                name
            }
            ... on System {
                id
                name
                network {
                    id
                    name
                }
                serviceCategoryNumber
                category
                serviceCatalog {
                  id
                  name
                  number
                }
            }
            ... on Task {
                id
                name
            }
        }
    }
`
