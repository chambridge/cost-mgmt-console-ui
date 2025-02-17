import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";
import './example.css';



async function fetchProjects() {
  const costurl = "api/proxy/plugin/cost-mgmt-ui-console-plugin/cost-mgmt-proxy/api/cost-management/v1/reports/openshift/costs/?currency=USD&delta=distributed_cost&filter[cluster]=023d9b0e-7ca6-481d-b04f-ea606becd54e&filter[limit]=10&filter[offset]=0&filter[resolution]=monthly&filter[time_scope_units]=month&filter[time_scope_value]=-1&group_by[project]=*&order_by[distributed_cost]=desc";
  const response = await fetch(`${costurl}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetc secret: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}


export default function ExamplePage() {
  const { t } = useTranslation('plugin__cost-mgmt-ui-console-plugin');
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    const loadProjects = async () => {
      const { data } = await fetchProjects();
        setProjects(data.data[0].projects);
    };
    loadProjects();
  }, [fetchProjects]);

  // const columns = ["Project", "Cost"];
  // const rows = projects.map((project) => [project.project, project.values[0].cost.total.value])

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{t('Projects')}</title>
      </Helmet>
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
                  <Td>project.project</Td>
                  <Td>project.values[0].cost.total.value.toFixed(2</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageSection>

      </Page>
    </>
  );
}
