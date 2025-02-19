"use client";
import AddUserModal from "@/components/AddUserModal/AddUserModal";
import AuthorizedPage from "@/components/AuthorizedPage/AuthorizedPage";
import UpdateUserModal from "@/components/UpdateUserModal/UpdateUserModal";
import {
  Button,
  Title,
  Text,
  Dialog,
  Space,
  Table,
  Group,
  FileButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Admin = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [backingUp, setBackingUp] = useState(false);
  const [restoringDb, setRestoringDb] = useState(false);
  const [error, setError] = useState(false);
  const [gifCount, setGifCount] = useState();
  const [scanning, setScanning] = useState(false);
  const [gifsAdded, setGifsAdded] = useState(0);
  const [users, setUsers] = useState<Array<User>>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [errorOpened, { open: errorOpen, close: errorClose }] =
    useDisclosure(false);

  const [rebuilding, setRebuilding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>();
  const [dialogOpened, { close: dialogClose }] = useDisclosure(false);
  const [updateOpened, { open: updateOpen, close: updateClose }] =
    useDisclosure(false);
  const [file, setFile] = useState<File | null>(null);

  const getCount = async () => {
    const countRequest = await fetch("/api/admin/count");
    setGifCount((await countRequest.json()).gifCount);
  };

  const getUserList = async () => {
    const usersRequest = await fetch("/api/admin/users");
    setUsers((await usersRequest.json()).users);
  };

  const scanForGifs = async () => {
    setScanning(true);
    const countRequest = await fetch("/api/admin/scan");
    setGifsAdded((await countRequest.json()).newGifs);
    setScanning(false);
  };

  const rebuildSearch = async () => {
    setRebuilding(true);
    await fetch("/api/search/updateIndex", { method: "POST" });
    setRebuilding(false);
  };

  const backupDb = async () => {
    setBackingUp(true);
    await fetch("/api/admin/backup", { method: "POST" });
    setBackingUp(false);
  };

  const restoreDb = async () => {
    setRestoringDb(true);
    const formData = new FormData();
    formData.append("file", file);
    const request = await fetch("/api/admin/restore", {
      method: "PUT",
      body: formData,
    });
    const response = await request.json();
    if (request.status === 500) {
      setError(response.error);
      errorOpen();
    }
    if (request.status === 200) {
      router.refresh();
    }
    setRestoringDb(false);
  };

  /** More logic needs to be done here, should be a soft delete
  const deleteUser = async (userId: string) => {
   
    const deletedResponse = await fetch("/api/admin/deleteUser", {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    });
    getUserList();
    dialogOpen();
    
  };
 */

  const changeUsernameOrPassword = async (user: User) => {
    setEditingUser(user);

    updateOpen();
  };

  useEffect(() => {
    getCount();
    getUserList();
  }, [gifsAdded]);

  const userRows = () => {
    const rows = users.map((user) => (
      <Table.Tr key={user.id}>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{`${user.createdAt}`}</Table.Td>
        <Table.Td>{user.role.name}</Table.Td>
        <Table.Td></Table.Td>
        <Table.Td>
          <Group>
            <Button size="xs" onClick={() => changeUsernameOrPassword(user)}>
              Change name / password
            </Button>
            {!user.isDefaultUser && (
              <Button variant="light" size="xs" color="red" disabled>
                Delete User
              </Button>
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
    return rows;
  };

  return (
    <AuthorizedPage requiresAdmin>
      <Space h="xl" />
      <Title>Hi {session?.user.name}</Title>
      <Text>There are {gifCount} gifs here.</Text>

      <Space h="xl" />
      <Title order={2}>Scan directory</Title>

      <Text>
        This will rescan the directory you’ve configured to hold your gifs and
        update the database with any new files.
      </Text>
      <Space h="md" />
      <Button onClick={scanForGifs} loading={scanning}>
        Scan
      </Button>

      <Space h="xl" />

      <Title order={2}>Rebuild search index</Title>

      <Space h="md" />
      <Button onClick={rebuildSearch} loading={rebuilding}>
        Rebuild search index
      </Button>

      <Space h="xl" />

      <Title order={2}>Users</Title>
      <Group justify="flex-end">
        <Button onClick={open}>Add User</Button>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User Name</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Gifs</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{userRows()}</Table.Tbody>
      </Table>

      <Space h="xl" />
      <Title order={2}>Database Backup</Title>
      <Text>
        Backup the SQLite db to the same S3 bucket where your gifs are stored.
      </Text>
      <Space h="md" />
      <Button onClick={backupDb} loading={backingUp}>
        Backup Now
      </Button>

      <Space h="xl" />
      <Title order={2}>Database Restore</Title>
      <Text>Upload a SQLite db to overwrite the existing one.</Text>
      <Space h="md" />
      <Group>
        <FileButton onChange={setFile} accept="application/x-sqlite3">
          {(props) => <Button {...props}>Select DB file</Button>}
        </FileButton>
        <Button disabled={!file} color="red" onClick={() => setFile(null)}>
          Reset
        </Button>
        {file && (
          <Button onClick={restoreDb} loading={restoringDb}>
            Restore DB
          </Button>
        )}
      </Group>

      <AddUserModal opened={opened} close={close} />

      <UpdateUserModal
        currentUser={editingUser}
        opened={updateOpened}
        close={updateClose}
      />

      {error && (
        <Dialog opened={errorOpened} onClose={errorClose}>
          {error}
        </Dialog>
      )}

      <Dialog
        opened={dialogOpened}
        onClose={dialogClose}
        withCloseButton
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" fw={500}>
          Database updated
        </Text>
        <Text size="sm">Added {gifsAdded} gifs.</Text>
      </Dialog>
    </AuthorizedPage>
  );
};

export default Admin;
