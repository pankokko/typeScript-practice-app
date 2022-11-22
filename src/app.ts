
//validate
interface Validatable{
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable){
  let isValid = true;
  
  if(validatableInput.required){
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if(validatableInput.minLength && typeof validatableInput.value === "string"){
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength
  }

  if(validatableInput.maxLength != null && typeof validatableInput.value === "string"){
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
  }

  if(validatableInput.min != null && typeof validatableInput.value === "string"){
    isValid = isValid && validatableInput.value.length >= validatableInput.min
  }

  if(validatableInput.max != null && typeof validatableInput.value === "string"){
    isValid = isValid && validatableInput.value.length <= validatableInput.max
  }

  return isValid;
}

// autobind decorator 
function autobind(_: any, _2: string, descriptor: PropertyDescriptor){

  const originalMethod = descriptor.value;

  const adjDescriptor: PropertyDescriptor = {
    configurable:true,
    get(){
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };

  return adjDescriptor;

}

type ProjectType = "active" | "finished"

//ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement
  element: HTMLElement;
  constructor(private type: ProjectType){
    this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')! ;
    this.hostElement = <HTMLDivElement>document.getElementById('app')!;

    const importedNode = document.importNode(this.templateElement.content, true);

    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent(){
    const listId = `${this.type}-projects-list`
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type === 'active' ? '実行プロジェクト' : '完了プロジェクト';
  }

  private attach(){
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }

}


// ProjectInput Class
class ProjectInput{

  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement
  element: HTMLElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;
  
  constructor(){
    this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')! ;
    this.hostElement = <HTMLDivElement>document.getElementById('app')!;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
    this.mandayInputElement = this.element.querySelector("#manday") as HTMLInputElement

    this.configure();
    this.attach();

  }

  private gatherUserInput(): [string, string, number] | void {

      const enterdTitle = this.titleInputElement.value;
      const enterdDescription = this.descriptionInputElement.value;
      const enterdManday = this.mandayInputElement.value;
    
      const titleValidatable: Validatable = {
          value: enterdTitle,
          required: true,
      };
      
      const descriptionValidatable: Validatable = {
          value: enterdDescription,
          required: true,
          minLength: 5,
      };

      const mandayValidatable: Validatable = {
          value: +enterdManday,
          required: true,
          min: 1,
          max: 1000,
      };

      if(!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(mandayValidatable) ){
        alert("入力値が正しくありません。")
        return;
      } else {
        return [enterdTitle, enterdDescription, +enterdManday]
      }

  }

  @autobind
  private submitHandler(event: Event){
    
    event.preventDefault();
    
    const userInput = this.gatherUserInput();

    if(Array.isArray(userInput)){

      const [title,desc, manday] = userInput;
      
     const activeProject =  new ActiveProjectList();
     activeProject.addProject({
      title: title,        
      description: desc,
      manDay: manday
    });      
      this.clearInputs();
    }

  }

  private clearInputs(){
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.mandayInputElement.value = "";
  }

  private configure(){
    this.element.addEventListener("submit", this.submitHandler.bind(this))
  }

  private attach(){
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

interface ActiveProject{
  type?: ProjectType;
  title: string;
  description: string;
  manDay: number;
}


class ActiveProjectList {
  ulElement: HTMLElement;

  constructor(){
    this.ulElement = <HTMLDivElement>document.getElementById('active-projects-list')!;
    console.log(this.ulElement);
  }

  public addProject(data: ActiveProject){
    const li = document.createElement('li');
    
    const title = document.createTextNode(data.title);
    const decsription = document.createTextNode(data.description);
    const manDay = document.createTextNode(String(data.manDay));
    
    li.appendChild(title);
    li.appendChild(decsription);
    li.appendChild(manDay);

    this.ulElement.append(li);

  }

}


const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
// const activeProjectList = new ActiveProjectList(); // ProjectInput内から呼び出すようにする
