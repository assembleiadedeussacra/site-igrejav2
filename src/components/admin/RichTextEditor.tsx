'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
    });

    // Update editor content when content prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const addImage = async () => {
        if (!editor || !onImageUpload) return;

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                toast.error('Por favor, selecione um arquivo de imagem.');
                return;
            }

            // Validar tamanho do arquivo (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error('O arquivo deve ter no máximo 5MB.');
                return;
            }

            try {
                const url = await onImageUpload(file);
                editor.chain().focus().setImage({ src: url }).run();
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Erro ao fazer upload da imagem. Tente novamente.');
            }
        };
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-gray-200 rounded-[10px] overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-2 rounded-[10px] transition-colors ${editor.isActive('bold') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    title="Negrito"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-[10px] transition-colors ${editor.isActive('italic') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    title="Itálico"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded-[10px] transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    title="Título 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded-[10px] transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    title="Título 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-[10px] transition-colors ${editor.isActive('bulletList') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    title="Lista"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-[10px] transition-colors ${editor.isActive('orderedList') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    title="Lista Numerada"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <button
                    type="button"
                    onClick={() => {
                        const url = window.prompt('Digite a URL do link:');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    className={`p-2 rounded-[10px] transition-colors ${editor.isActive('link') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    title="Adicionar Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                {onImageUpload && (
                    <button
                        type="button"
                        onClick={addImage}
                        className="p-2 rounded-[10px] bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Adicionar Imagem"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
            {/* Editor */}
            <EditorContent editor={editor} className="min-h-[300px]" />
        </div>
    );
}

