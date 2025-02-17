import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
// import { Page, PageSection, Text, TextContent, Title } from '@patternfly/react-core';
import { Page, PageSection, Title } from '@patternfly/react-core';
// import { CheckCircleIcon } from '@patternfly/react-icons';
import './example.css';
import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";



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
        {/* <PageSection variant="light">
          <TextContent>
            <Text component="p">
              <span className="cost-mgmt-ui-console-plugin__nice">
                <CheckCircleIcon /> {t('Success!')}
              </span>{' '}
              {t('Your plugin is working.')}
            </Text>
            <Text component="p">
              {t(
                'This is a custom page contributed by the console plugin template. The extension that adds the page is declared in console-extensions.json in the project root along with the corresponding nav item. Update console-extensions.json to change or add extensions. Code references in console-extensions.json must have a corresponding property',
              )}
              <code>{t('exposedModules')}</code>{' '}
              {t('in package.json mapping the reference to the module.')}
            </Text>
            <Text component="p">
              {t('After cloning this project, replace references to')}{' '}
              <code>{t('console-template-plugin')}</code>{' '}
              {t('and other plugin metadata in package.json with values for your plugin.')}
            </Text>
          </TextContent>
        </PageSection> */}

        <PageSection>
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th> Project</Th>
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
