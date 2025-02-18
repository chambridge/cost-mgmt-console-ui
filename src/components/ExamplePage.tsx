import * as React from 'react';
// import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Content, Title } from '@patternfly/react-core';
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
    throw new Error(`Failed to fetch secret: ${response.statusText}`);
  }

  const jsonData = await response.json();
  return jsonData;
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
          <Content>
            <p>
              {projects}
            </p>
          </Content>
        </PageSection>
      </Page>
    </>
  );
}
