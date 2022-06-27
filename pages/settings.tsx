import * as React from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { updateUserProfile } from '~/lib/user-api';
import { useAuth } from '~/context';
import { useRouter } from 'next/router';
import { supabase } from '~/lib';
import { AppUser } from '~/types';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(ctx.req);

    if (!user) {
      return {
        props: {
          jiraToken: '',
        },
      };
    }

    const { data } = await supabase
      .from<AppUser>('profile')
      .select('jira_access_token')
      .eq('id', user.id)
      .single();

    if (!data) {
      return {
        props: {
          jiraToken: '',
        },
      };
    }

    return {
      props: { jiraToken: data.jira_access_token },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        jiraToken: '',
      },
    };
  }
}

interface SettingsProps {
  jiraToken: string;
}

const Settings: NextPage<SettingsProps> = ({ jiraToken }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [token, setToken] = React.useState(jiraToken);
  const [isHidden, setIsHidden] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile(user.id, { jira_access_token: token });
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Heading as="h1" size="lg" mb={8}>
        User settings
      </Heading>
      <Stack as="form" spacing={8} onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="jira-access-token">JIRA Access Token</FormLabel>
          <InputGroup>
            <Input
              id="jira-access-token"
              type={isHidden ? 'password' : 'text'}
              autoComplete="new-password"
              value={token}
              onChange={handleChange}
            />
            <InputRightElement>
              <IconButton
                aria-label="Show password"
                onClick={() => setIsHidden(!isHidden)}
                icon={isHidden ? <ViewIcon /> : <ViewOffIcon />}
              />
            </InputRightElement>
          </InputGroup>
          <FormHelperText>We&apos;ll never share your email.</FormHelperText>
        </FormControl>
        <Stack direction="row">
          <Button
            type="submit"
            minW={110}
            colorScheme="green"
            isLoading={isSaving}
            loadingText="Saving"
          >
            Save
          </Button>
          S
        </Stack>
      </Stack>
    </>
  );
};

export default Settings;
