// type ProjectType = "active" | "finished"

// enum ProjectStatus {
//   Active, Finished
// }

// class Project {
//   constructor(
//     public id: string,
//     public title: string,
//     public description: string, 
//     public manday: number,
//     public status: ProjectStatus
//   ){}
// }

// //listnerType 
// type Listener<T> = (items: T[]) => void;

// class State<T>{
  
//   protected listners: Listener<T>[] = [];
  
//   addListner(listnerFn: Listener<T>){
//     this.listners.push(listnerFn);
//   }

// }


// //Project State Management
// class ProjectState extends State<Project> {
//   private projects: Project[] =[];
//   private static instance: ProjectState;

//   private constructor(){
//     super();
//   }

//   static getInstance(){

//     if(!this.instance){
//       this.instance =  new ProjectState();
//       return this.instance;
//     }

//     return this.instance;
//   }

//   public addProject(title: string, decsription: string, manday: number){

//     const newProject = new Project(
//       Math.random.toString(),
//       title,
//       decsription,
//       manday, 
//       0
//       )

//     this.projects.push(newProject);

//     for (const listenerFn of this.listners){
//       listenerFn(this.projects.slice());
//     }

//   }
// }

// const projectState = ProjectState.getInstance();

// //validate
// interface Validatable{
//   value: string | number;
//   required?: boolean;
//   minLength?: number;
//   maxLength?: number;
//   min?: number;
//   max?: number;
// }

// function validate(validatableInput: Validatable){
//   let isValid = true;
  
//   if(validatableInput.required){
//     isValid = isValid && validatableInput.value.toString().trim().length !== 0;
//   }

//   if(validatableInput.minLength && typeof validatableInput.value === "string"){
//     isValid = isValid && validatableInput.value.length >= validatableInput.minLength
//   }

//   if(validatableInput.maxLength != null && typeof validatableInput.value === "string"){
//     isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
//   }

//   if(validatableInput.min != null && typeof validatableInput.value === "string"){
//     isValid = isValid && validatableInput.value.length >= validatableInput.min
//   }

//   if(validatableInput.max != null && typeof validatableInput.value === "string"){
//     isValid = isValid && validatableInput.value.length <= validatableInput.max
//   }

//   return isValid;
// }

// // autobind decorator 
// function autobind(_: any, _2: string, descriptor: PropertyDescriptor){

//   const originalMethod = descriptor.value;

//   const adjDescriptor: PropertyDescriptor = {
//     configurable:true,
//     get(){
//       const boundFn = originalMethod.bind(this);
//       return boundFn;
//     }
//   };

//   return adjDescriptor;

// }




// //component class 

// abstract class Component<T extends HTMLElement , U extends HTMLElement> {
  
//   templateElement: HTMLTemplateElement;
//   hostElement: T;
//   element: U;

//   constructor(
//     templateId: string, 
//     hostElementId: string,  
//     insertAtStart: boolean,
//     newElementId?: string){
//     this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
//     this.hostElement = document.getElementById(hostElementId)! as T;


//     const importedNode = document.importNode(this.templateElement.content, true);

//     this.element = importedNode.firstElementChild as U;
    
//     if(newElementId){
//       this.element.id = newElementId;

//     }
//     this.attach(insertAtStart);
//   }

//   abstract configure(): void;
//   abstract renderContent(): void;

//   private attach(insertAtBeginning: boolean){
//     this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend",  this.element);
//   }


// }


// // ProjectInput Class
// class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{

//   titleInputElement: HTMLInputElement;
//   descriptionInputElement: HTMLInputElement;
//   mandayInputElement: HTMLInputElement;
  
//   constructor(){
//     super('project-input', 'app',  true, "user-input");
  
//     this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
//     this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
//     this.mandayInputElement = this.element.querySelector("#manday") as HTMLInputElement

//     this.configure();
    
//   }

//   public configure(){
//     this.element.addEventListener("submit", this.submitHandler.bind(this))
//   }

//   public renderContent(){}


//   private gatherUserInput(): [string, string, number] | void {

//       const enterdTitle = this.titleInputElement.value;
//       const enterdDescription = this.descriptionInputElement.value;
//       const enterdManday = this.mandayInputElement.value;
    
//       const titleValidatable: Validatable = {
//           value: enterdTitle,
//           required: true,
//       };
      
//       const descriptionValidatable: Validatable = {
//           value: enterdDescription,
//           required: true,
//           minLength: 5,
//       };

//       const mandayValidatable: Validatable = {
//           value: +enterdManday,
//           required: true,
//           min: 1,
//           max: 1000,
//       };

//       if(!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(mandayValidatable) ){
//         alert("入力値が正しくありません。")
//         return;
//       } else {
//         return [enterdTitle, enterdDescription, +enterdManday]
//       }

//   }

//   @autobind
//   private submitHandler(event: Event){
    
//     event.preventDefault();
    
//     const userInput = this.gatherUserInput();

//     if(Array.isArray(userInput)){
//       const [title,desc, manday] = userInput;

//       projectState.addProject(title, desc, manday);

//       this.clearInputs();
//     }

//   }

//   private clearInputs(){
//     this.titleInputElement.value = "";
//     this.descriptionInputElement.value = "";
//     this.mandayInputElement.value = "";
//   }

// }

// //ProjectList Class
// class ProjectList  extends Component<HTMLDivElement, HTMLElement> {
//   assignedProjects: Project[] = [];

//   constructor(private type: ProjectType){
//     super('project-list', 'app', false, `${type}-projects`);
//     this.configure();
//     this.renderContent();
//   }



//   configure() {

//     projectState.addListner((projects: Project[]) =>{

//       const relevantProjects = projects.filter(prj => {
 
//         if(this.type === "active"){
//           return  prj.status === ProjectStatus.Active
//         } 
//           return prj.status === ProjectStatus.Finished 

//       })

//       this.assignedProjects = relevantProjects;
//       this.renderProjects();
//     })

//   }


//   public renderContent(){
//     const listId = `${this.type}-projects-list`
//     this.element.querySelector('ul')!.id = listId;
//     this.element.querySelector('h2')!.textContent = this.type === 'active' ? '実行プロジェクト' : '完了プロジェクト';
//   }


//   private renderProjects(){

//     const ulEl =   document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
//     ulEl.innerHTML = ""; //既に同じリストがあるにも関わらず複製されるのを防止する。

//     for (const projectItem of this.assignedProjects){
      
//       const listItem = document.createElement('li');

//       listItem.textContent = projectItem.title

//       ulEl.appendChild(listItem);
    
//     }
// }

  

// }




// const prjInput = new ProjectInput();
// const activePrjList = new ProjectList('active');
// const finishedPrjList = new ProjectList('finished');
