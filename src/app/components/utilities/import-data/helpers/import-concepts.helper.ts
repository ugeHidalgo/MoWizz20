import { Observable } from 'rxjs';
import { Concept } from 'src/app/models/concept';
import { ConceptsService } from 'src/app/services/concepts/concepts.service';

export class ImportConceptsHelper {

  fieldNames: string[];

  constructor(
    private service: ConceptsService
  ) { }

  import(data): Observable<Concept[]> {
    const me = this;
    var concept: Concept,
        conceptsToSave: Concept[] = [],
        nameIndex,
        typeIndex,
        companyIndex,
        descriptionIndex,
        activeIndex;

    me.fieldNames = data[0];
    nameIndex = me.fieldNames.indexOf('Name');
    typeIndex = me.fieldNames.indexOf('Type');
    companyIndex = me.fieldNames.indexOf('Company');
    descriptionIndex = me.fieldNames.indexOf('Description');
    activeIndex = me.fieldNames.indexOf('Active');

    for (var f=1; f<data.length; f++)
    {
      var rowData = data[f];

      concept = new Concept;
      concept.name = rowData[nameIndex];
      concept.transactionType = rowData[typeIndex];
      concept.company = rowData[companyIndex];
      concept.description = rowData[descriptionIndex];
      concept.active = rowData[activeIndex].trim() === 'true' ? true : false;
      concept.updated = new Date();
      concept.created = new Date();

      conceptsToSave.push(concept);
    }

    return me.service.createConcepts(conceptsToSave);
  }
};