import * as React from 'react';
// import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";
import './example.css';



async function fetchProjects() {
  var projects = []
  const costurl = "api/proxy/plugin/cost-mgmt-ui-console-plugin/cost-mgmt-proxy/api/cost-management/v1/reports/openshift/costs/?currency=USD&delta=distributed_cost&filter[cluster]=023d9b0e-7ca6-481d-b04f-ea606becd54e&filter[limit]=10&filter[offset]=0&filter[resolution]=monthly&filter[time_scope_units]=month&filter[time_scope_value]=-1&group_by[project]=*&order_by[distributed_cost]=desc";
  const response = await fetch(`${costurl}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    // throw new Error(`Failed to fetch data: ${response.statusText}`);
    projects = [{"name": "p1", "cost": 3}];
    return projects;
  }

  const jsonData = await response.json();
  console.log(jsonData);
  if (jsonData && "data" in jsonData) {
    if (jsonData["data"] && jsonData["data"].length > 0) {
      if ("projects" in jsonData["data"][0]) {
        console.log("jsonData[data][0] = " + jsonData["data"][0]);
        console.log("data - projects = " + jsonData["data"][0]["projects"]);
        for (var project of jsonData["data"][0]["projects"]) {
          console.log(project);
          var projData = {"name": project["project"], "cost": project["values"][0]["cost"]["distributed"]["value"]};
          projects.push(projData);
        }
      } else {
        console.log("projects not in jsonData[data][0]");
      }
    } else {
      console.log("jsonData[data].length is 0");
    }
  } else {
    console.log("data not in jsonData");
  }
  
  console.log("projects = " + projects)
  return projects;
}


export default function ExamplePage() {
  const { t } = useTranslation('plugin__cost-mgmt-ui-console-plugin');
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    const loadProjects = async () => {
      var data = await fetchProjects();
      console.log("setProjects");
      setProjects(data);
    };
    loadProjects();
  }, [fetchProjects]);


  return (
    <>
      <head>
        <title data-test="example-page-title">{t('Projects')}</title>
      </head>
      <Page>
        <PageSection>
          <Title headingLevel="h1">{t('Projects')}</Title>
        </PageSection>
        <PageSection>
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Project</Th>
                <Th>Cost</Th>
              </Tr>
            </Thead>
            <Tbody>
              {projects.map((project) => (
                <Tr>
                  <Td>{project['name']}</Td>
                  <Td>${project['cost'].toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageSection>

      </Page>
    </>
  );
}
