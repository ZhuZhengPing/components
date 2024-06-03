import { createApp, reactive, h } from 'vue';
import GlobalDialog from '@/components/template-model/dialog-html.vue';
import RuntimeTemplate from 'vue3-runtime-template';

const dialogState = reactive({
    visible: false,
    content: '',
    title: '',
    width: '50%',
    onConfirm: null,
    onCancel: null
});

const showDialog = (options) => {
    dialogState.visible = true;
    dialogState.title = options.title || '';
    dialogState.width = options.width || '50%';
    dialogState.content = options.content || '';
    dialogState.onConfirm = options.onConfirm || (() => { });
    dialogState.onCancel = options.onCancel || (() => { });
};

const hideDialog = () => {
    dialogState.visible = false;
};

const DialogHTMLPlugin = {
    install(app) {
        app.config.globalProperties.$dialogHtml = {
            show: showDialog,
            hide: hideDialog
        };

        const dialogApp = createApp({
            setup() {
                return () => h(
                    GlobalDialog,
                    {
                        visible: dialogState.visible,
                        title: dialogState.title,
                        width: dialogState.width,
                        onConfirm: dialogState.onConfirm,
                        onCancel: dialogState.onCancel,
                        content: dialogState.content,
                        'onUpdate:visible': (val) => { dialogState.visible = val; }
                    }
                );
            }
        });

        dialogApp.component('runtime-template', RuntimeTemplate);

        const div = document.createElement('div');
        document.body.appendChild(div);
        dialogApp.mount(div);
    }
};

export default DialogHTMLPlugin;