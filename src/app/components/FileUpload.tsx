import { Progress, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import mammoth from 'mammoth';

const { Dragger } = Upload;

interface FileUploadProps {
    onFileUploaded: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
    const [fileList, setFileList] = useState<UploadFile<File>[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const props = {
        name: 'file',
        multiple: false,
        fileList,
        beforeUpload: (file: File) => {
            const isSupportedType =
                file.type === 'application/pdf' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            if (!isSupportedType) {
                message.error(`${file.name}은 지원되지 않는 파일 형식입니다.`);
            }
            return isSupportedType || Upload.LIST_IGNORE;
        },
        onChange(info: UploadChangeParam<UploadFile<File>>) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} 파일이 성공적으로 업로드되었습니다.`);
                const file = info.file.originFileObj as File;

                if (file.type === 'application/pdf') {
                    // Handle PDF files if needed
                } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    // Handle DOCX files
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            const arrayBuffer = e.target?.result as ArrayBuffer;
                            const result = await mammoth.convertToHtml({ arrayBuffer });
                            onFileUploaded(result.value); // result.value contains the HTML content
                        } catch (error) {
                            console.error('Error reading DOCX file:', error);
                            message.error('DOCX 파일 읽기에 실패했습니다.');
                        }
                    };
                    reader.onprogress = (e) => {
                        if (e.lengthComputable) {
                            const percentLoaded = Math.round((e.loaded / e.total) * 100);
                            setUploadProgress(percentLoaded);
                        }
                    };
                    reader.readAsArrayBuffer(file);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} 파일 업로드에 실패했습니다.`);
            }
            setFileList(info.fileList as UploadFile<File>[]);
        },
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">이 영역을 클릭하거나 파일을 드래그하여 업로드하세요</p>
                <p className="ant-upload-hint">
                    단일 파일 업로드만 지원됩니다. 회사 데이터나 기타 민감한 파일의 업로드는 엄격히 금지됩니다.
                </p>
            </Dragger>
            {uploadProgress > 0 && uploadProgress < 100 && (
                <Progress percent={uploadProgress} status="active" className="mt-4" />
            )}
        </div>
    );
};

export default FileUpload;
