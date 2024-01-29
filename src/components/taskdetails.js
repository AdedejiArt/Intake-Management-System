import './Taskdetails.css'
const Taskdetails = (props) =>{
    const data = props.task
    const preview = props.pdfPreview
    console.log(preview)
    const generated = props.messageContent
     
    return (
        <div>
        <div className="asana-task-details">
         
          <h2 className="task-details-heading">{data.Name}</h2>
          <div className='beautify'>
          <p>Assignee : </p>
          <p>{data.assignee}</p>
          </div>
          
          <div className='beautify'>
          <p> Due date : </p>
          <p>{data.enteredduedate}</p>
          </div>
          <div >
          <h3> Context</h3>
          <p>{data.partner}</p>
          <p>The Value of the contract:{data.value}</p>
          </div>
           
          <div className="task-details-value task-details-assignee">{data.value}</div>
          <div className="task-details-label">{}</div>
          <div className="task-details-value task-details-description">{}</div>
       
        </div>
        <div>
          {preview}
          
        </div>
        
        <div className='AI-generated'>
        <h3> A.I Generated Suggestion Box</h3>
        {generated}
        </div>
        </div>
      
    )
}

export default Taskdetails