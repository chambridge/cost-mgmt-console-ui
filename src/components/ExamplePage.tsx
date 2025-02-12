import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Text, TextContent, Title } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import './example.css';
import * as fs from 'fs/promises';


async function readFileContents(filePath: string): Promise<string> {
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    return fileContents;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
}

async function getOpenShiftSecret() {
  const namespace = "costmanagement-metrics-operator";
  const secretName = "operator-service-account";
  const filePath = '/var/run/secrets/kubernetes.io/serviceaccount/token';
  const saToken =  readFileContents(filePath)
  .then(contents => {
    console.log('File contents:');
    console.log(contents);
  })
  .catch(error => {
    console.error('Failed to read file.');
  });

  console.log('saToken: %s', saToken);
  console.log('namespace: %s', namespace);
  console.log('secretName: %s', secretName);
  const response = await fetch(`/api/kubernetes/api/v1/namespace/${namespace}/secrets/${secretName}`, {
      headers: {
        'Authorization': `Bearer ${saToken}`,
        'Accept': 'application/json'
      }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetc secret: ${response.statusText}`);
  }

  const data = await response.json();
  const clientId = atob(data.data["client_id"])
  const client_secret = atob(data.data["client_secret"])
  return [clientId, client_secret]
}


export default function ExamplePage() {
  const { t } = useTranslation('plugin__cost-mgmt-ui-console-plugin');
  const [token, setToken] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = await getOpenShiftSecret();
      setToken(token);
    };
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{t('Hello, Plugin!')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{t('Hello, Plugin!')}</Title>
        </PageSection>
        <PageSection variant="light">
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
            <Text>`{token}`</Text>
          </TextContent>
        </PageSection>
      </Page>
    </>
  );
}
