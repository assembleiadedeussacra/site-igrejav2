'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
    Bold, 
    Italic, 
    List, 
    ListOrdered, 
    Heading1, 
    Heading2, 
    Quote,
    Code,
    Link as LinkIcon, 
    Image as ImageIcon,
    Undo,
    Redo,
    Strikethrough
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-6 bg-white',
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

    const setLink = () => {
        if (!editor) return;
        
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Digite a URL do link:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    if (!editor) {
        return (
            <div className="border border-gray-200 rounded-[10px] overflow-hidden min-h-[400px] flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Carregando editor...</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-[10px] overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('bold') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Negrito (Ctrl+B)"
                        aria-label="Aplicar negrito"
                        aria-pressed={editor.isActive('bold')}
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('italic') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Itálico (Ctrl+I)"
                        aria-label="Aplicar itálico"
                        aria-pressed={editor.isActive('italic')}
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={!editor.can().chain().focus().toggleStrike().run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('strike') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Riscado"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300" />

                {/* Headings */}
                <div className="flex items-center gap-1">
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
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Título 3"
                    >
                        <span className="text-xs font-bold">H3</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('heading', { level: 4 }) ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Título 4"
                    >
                        <span className="text-xs font-bold">H4</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('heading', { level: 5 }) ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Título 5"
                    >
                        <span className="text-xs font-bold">H5</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('heading', { level: 6 }) ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Título 6"
                    >
                        <span className="text-xs font-bold">H6</span>
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300" />

                {/* Lists */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('bulletList') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Lista com marcadores"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('orderedList') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Lista numerada"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300" />

                {/* Blockquote & Code */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('blockquote') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Citação"
                    >
                        <Quote className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={!editor.can().chain().focus().toggleCode().run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('code') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Código inline"
                    >
                        <Code className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('codeBlock') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Bloco de código"
                    >
                        <Code className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300" />

                {/* Link & Image */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={setLink}
                        className={`p-2 rounded-[10px] transition-colors ${editor.isActive('link') ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Adicionar/Editar Link"
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

                <div className="w-px h-6 bg-gray-300" />

                {/* Undo/Redo */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        className="p-2 rounded-[10px] bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Desfazer (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        className="p-2 rounded-[10px] bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refazer (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="bg-white">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
