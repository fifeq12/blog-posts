class ModalHelper {
    static toggleBackdrop() {
        this.backdrop.classList.toggle('visible');
    }

    static showModal(type){
        this.toggleBackdrop();
        switch(type){
            case 'edit':
                this.editPostModal.classList.add('visible');
                break;
            case 'add':
                this.addPostModal.classList.add('visible');
                break;
            case 'delete':
                this.deletePostModal.classList.add('visible');
                break;
        }
    }

    static closeModal() {
        this.toggleBackdrop();
        this.addPostModal.classList.remove('visible');
        this.deletePostModal.classList.remove('visible');
        this.editPostModal.classList.remove('visible');
    }

    static initModals(){
        this.backdrop = document.querySelector('.backdrop');
        this.backdrop.addEventListener('click', this.closeModal.bind(this));
        this.addPostModal = document.querySelector('.add-post-modal');
        this.deletePostModal = document.querySelector('.delete-post-modal');
        this.editPostModal = document.querySelector('.edit-post-modal');
        document.querySelector('.add-post-button')
            .addEventListener('click', this.showModal.bind(this, 'add'));
        for(const button of document.querySelectorAll('.btn-cancel'))
            button.addEventListener('click', this.closeModal.bind(this));
    }
}

class PostList {
    constructor() {
        this.initList();
    }

    addPost() {
        const postItem = new PostItem(this.userInputs, this.userTextAreas);
        const postHTMLElement = postItem.createHTMLElement();
        this.postList.append(postHTMLElement);
        this.posts.push(postItem);
        postHTMLElement.querySelector('.btn-delete-post')
            .addEventListener('click', this.confirmDeletePost.bind(this, postItem.id));
        postHTMLElement.querySelector('.btn-edit-post')
            .addEventListener('click', this.openEditForm.bind(this, postItem.id));
        ModalHelper.closeModal();
        this.clearUserInputs();
    }

    confirmDeletePost(id){
        ModalHelper.showModal('delete');
        this.deletePostButton.replaceWith(this.deletePostButton.cloneNode(true));
        this.deletePostButton = document.querySelector('.btn-delete');
        this.deletePostButton
            .addEventListener('click', this.deletePost.bind(this, id))
    }

    openEditForm(id) {
        const post = this.posts.find(post => post.id == id);
        this.userInputs[2].value = post.title;
        this.userTextAreas[1].value = post.description;
        this.userInputs[3].value = post.author;
        ModalHelper.showModal('edit');
        this.editPostButton.replaceWith(this.editPostButton.cloneNode(true));
        this.editPostButton = document.querySelector('.btn-edit');
        this.editPostButton
            .addEventListener('click', this.editPost.bind(this, id))
    }

    editPost(id) {
        const post = document.getElementById(id);
        post.querySelector('h2').textContent = this.userInputs[2].value;
        post.querySelector('p').textContent = this.userTextAreas[1].value;
        post.querySelector('h4').textContent = 'Author: ' + this.userInputs[3].value;
        for(let i = 0; i < this.posts.length; i++){
            if(this.posts[i].id == id) {
                this.posts[i].title = this.userInputs[2].value;
                this.posts[i].description = this.userTextAreas[1].value;
                this.posts[i].author = this.userInputs[3].value;
            }
        }
        ModalHelper.closeModal();
        this.clearUserInputs();
    }

    deletePost(id) {
        for(let i = 0; i < this.posts.length; i++){
            if(this.posts[i].id == id)
                this.posts.splice(i, 1);
        }
        document.getElementById(id).remove();
        ModalHelper.closeModal();
    }

    clearUserInputs() {
        for (const userInput of this.userInputs) {
            userInput.value = '';
          }
        for (const userTextArea of this.userTextAreas) {
            userTextArea.value = '';
          }
    }

    initList() {
        this.posts = [];
        this.postList = document.querySelector('.blog-wall');
        this.userInputs = document.querySelectorAll('input');
        this.userTextAreas = document.querySelectorAll('textarea');
        document.querySelector('.btn-add')
            .addEventListener('click', this.addPost.bind(this));
        this.deletePostButton = document.querySelector('.btn-delete');
        this.editPostButton = document.querySelector('.btn-edit');
    }
}

class PostItem {
    constructor(userInputs, userTextArea){
        this.id = Math.random();
        this.title = userInputs[0].value;
        this.description = userTextArea[0].value;
        this.author = userInputs[1].value;
    }

    createHTMLElement() {
        const newPost = document.createElement('li');
        newPost.className = 'post-element';
        newPost.id = this.id;
        newPost.innerHTML = `
            <div class="post-title">
            <h2>${this.title}</h2>
            <div class="post-actions">
                <i class="far fa-edit btn-edit-post"></i>
                <i class="far fa-trash-alt btn-delete-post"></i>
            </div> 
            </div>
            <div class="post-description">
                <p>${this.description}</p>
            </div>
            <div class="post-author"><h4>Author: ${this.author}</h4></div>`;
        return newPost;
    }
}

class Application {
    static init(){
        ModalHelper.initModals();
        new PostList();
    }
}

Application.init();