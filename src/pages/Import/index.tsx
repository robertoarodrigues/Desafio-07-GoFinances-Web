import React, { useState } from 'react';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    uploadedFiles.forEach(async file => {
      const upload: FileProps = {
        file: (file as unknown) as File,
        name: file.name,
        readableSize: file.readableSize,
      };

      data.append('files', upload.file, upload.name);

      try {
        await api.post('/transactions/import', data);
      } catch (err) {
        console.log(err.message);
      }
    });

    // history.push('/');
  }

  function submitFile(files: FileProps[]): void {
    files.forEach(file => (file.readableSize = filesize(1024).toString()));
    setUploadedFiles([...files]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
